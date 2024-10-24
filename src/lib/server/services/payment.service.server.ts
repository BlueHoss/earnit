import { ActionResponse, type EarnItActionResult } from '$lib/utilities/action-result';
import type { User } from 'lucia';
import Stripe from 'stripe';
import { PUBLIC_BASE_URL } from '$env/static/public';
import { login } from '../database/schema';
import { eq } from 'drizzle-orm';
import db from '$lib/server/database/drizzle';
import { LoggerService } from './logger.service.server';
import { PlanService } from './plan.service.server';
import { stripe } from '$lib/stripe/stripe.ts';
import { PlanRepository } from '../repositories/plan.repository.server';

async function cancelSubscription(subscriptionId: string): Promise<EarnItActionResult> {
	try {
		const canceledSubscription = await stripe.subscriptions.cancel(subscriptionId);

		if (canceledSubscription.status === 'canceled') {
			return ActionResponse.success('Subscription canceled successfully');
		} else {
			return ActionResponse.fail('Failed to cancel subscription');
		}
	} catch (error) {
		LoggerService.handleError(error, 'Error canceling Stripe subscription');
		return ActionResponse.fail('Error canceling subscription');
	}
}

async function billUserFirstTime(
	user: User,
	planId: number,
	creatorId: number
): Promise<EarnItActionResult> {
	if (!user) {
		return ActionResponse.fail('User not found. Payment failed.');
	}

	const plan = await PlanRepository.getPlanById(planId);

	if (!plan) {
		return ActionResponse.fail(`Plan was not found for planId: ${planId}`);
	}

	const priceId = plan.stripe_price_id;

	if (!priceId) {
		return ActionResponse.fail(`Stripe priceid was not found for ${plan.name}. Payment failed.`);
	}

	const planPrice = convertPriceToNoDecimal(Number(plan.plan_cost));

	if (planPrice <= 0) {
		return ActionResponse.fail(
			'Plan price is invalid. Must be greater than $0.00. Payment not processed.'
		);
	}

	let customerStripeId = user.stripe_customer_id;
	//Create user in Stripe
	if (!customerStripeId) {
		const stripeUserResult = await createStripeUser(user);
		if (!stripeUserResult.success) {
			return stripeUserResult;
		} else if (stripeUserResult.data) {
			customerStripeId = stripeUserResult.data.toString();
		} else {
			return ActionResponse.fail('Stripe user not created. Payment failed.');
		}
	}

	// create the payment intent
	const subscriptionIntent = await stripe.subscriptions.create({
		customer: customerStripeId,
		items: [
			{
				price: priceId,
				quantity: 1
			}
		],
		payment_behavior: 'default_incomplete',
		off_session: true,
		payment_settings: { save_default_payment_method: 'on_subscription' },
		expand: ['latest_invoice.payment_intent'],
		metadata: {
			planId: plan.id,
			planName: plan.name,
			creatorId: creatorId,
			earnerId: user.id
		}
	});

	return ActionResponse.successWithData('Payment intent created successfully', {
		subscriptionId: subscriptionIntent.id,
		secret: subscriptionIntent.latest_invoice.payment_intent.client_secret,
		returnUrl: new URL(
			`/market/${creatorId}/subscribe/success/${plan.id}`,
			PUBLIC_BASE_URL
		).toString()
	});
}

function convertPriceToNoDecimal(price: number): number {
	// Multiply by 100 to shift the decimal places
	const priceInCents = Math.round(price * 100);

	// Convert to string
	return priceInCents;
}

async function createStripeUser(user: User): Promise<EarnItActionResult> {
	let customer: Stripe.Customer | null = null;
	try {
		customer = await stripe.customers.create({
			name: `${user.first_name}  ${user.last_name}`,
			email: user.email,
			metadata: {
				source: 'EarnIt',
				userId: user.id,
				handle: user.handle,
				storeName: user.store_name
			}
		});

		if (!customer) {
			return ActionResponse.fail('Stripe user not created. Payment failed.');
		}

		//Update StripeCustomerId in User
		await db
			.update(login)
			.set({ stripe_customer_id: customer.id })
			.where(eq(login.id, Number(user.id)));

		return ActionResponse.successWithData('Stripe user created successfully', customer.id);
	} catch (error) {
		LoggerService.handleError(error, 'Error creating Stripe user');
		return ActionResponse.fail('Error creating Stripe user');
	}
}

async function getStripeSubscription(subscriptionId: string): Promise<EarnItActionResult> {
	try {
		const subscription = await stripe.subscriptions.retrieve(subscriptionId);
		return ActionResponse.successWithData('Subscription retrieved successfully', subscription);
	} catch (error) {
		LoggerService.handleError(error, 'Error retrieving Stripe subscription');
		return ActionResponse.fail('Error retrieving subscription');
	}
}

export const PaymentService = {
	billUserFirstTime,
	createStripeUser,
	cancelSubscription,
	getStripeSubscription
};
