import { stripe } from '$lib/stripe/stripe.ts';
import { error, json } from '@sveltejs/kit';
import { PRIVATE_STRIPE_WEBHOOK_SECRET } from '$env/static/private';
import { PlanService } from '$lib/server/services/plan.service.server';
import { LoggerService } from '$lib/server/services/logger.service.server.js';
import type Stripe from 'stripe';

// endpoint to handle incoming webhooks
export async function POST({ request }) {
	// extract body
	const body = await request.text();

	// get the signature from the header
	const signature = request.headers.get('stripe-signature') as string;

	// var to hold event data
	let event;
	const webhookSecret = PRIVATE_STRIPE_WEBHOOK_SECRET;
	// verify it
	try {
		event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
	} catch (err) {
		// signature is invalid!
		console.warn('⚠️  Webhook signature verification failed.', err);

		// return, because it's a bad request
		throw error(400, 'Invalid request');
	}

	/* Signature has been verified, so we can process events
	 *
	 * Review important events for Billing webhooks:
	 * https://stripe.com/docs/billing/webhooks
	 */
	switch (event.type) {
		case 'customer.subscription.created':
			break;
		case 'customer.subscription.updated':
			console.log('Subscription updated!!', event);
			// Subscription has been changed
			break;
		case 'invoice.paid':
			// Used to provision services after the trial has ended.
			// The status of the invoice will show up as paid. Store the status in your
			// database to reference when a user accesses your service to avoid hitting rate limits.
			//Create the subscription for the end user
			handleInvoicePaid(event);
			break;
		case 'invoice.payment_failed':
			// If the payment fails or the customer does not have a valid payment method,
			//  an invoice.payment_failed event is sent, the subscription becomes past_due.
			// Use this webhook to notify your user that their payment has
			// failed and to retrieve new card details.
			break;
		case 'customer.subscription.deleted':
			if (event.request != null) {
				// handle a subscription canceled by your request
				// from above.
			} else {
				// handle subscription canceled automatically based
				// upon your subscription settings.
			}
			break;
		default:
		// Unexpected event type
	}

	// return a 200 with an empty JSON response
	return json({});
}

async function handleInvoicePaid(event: Stripe.InvoicePaidEvent) {
	console.log('stripe.invoice.paid webhook event captured');

	//We will know it is a new subscription if the following metadata is present.
	const planId = event.data.object.subscription_details?.metadata?.planId;
	const creatorId = event.data.object.subscription_details?.metadata?.creatorId;
	const earnerId = event.data.object.subscription_details?.metadata?.earnerId;
	const subscriptionId = event.data.object.subscription as string;
	if (planId && creatorId && earnerId) {
		LoggerService.info(
			`stripe.invoice.paid webhook event captured for creator ${creatorId}, earner ${earnerId}, plan ${planId}`
		);
		const purchasePlanResult = await PlanService.purchaseRecurringPlan(
			Number(creatorId),
			Number(earnerId),
			Number(planId),
			subscriptionId
		);
		if (purchasePlanResult.success) {
			LoggerService.info(
				`stripe.invoice.paid webhook event processed successfully for creator ${creatorId}, earner ${earnerId}, plan ${planId}`
			);
		} else {
			LoggerService.error(
				`stripe.invoice.paid webhook event failed to process for creator ${creatorId}, earner ${earnerId}, plan ${planId}. Error: ${purchasePlanResult.message}`
			);
		}
	} else {
		LoggerService.error(
			`stripe.invoice.paid webhook event captured but data is missing. This might happen when stripe automatically bills an invoice. This should NOT happend when a user subscribes to a plan for the first time.  creatorId: '${creatorId}', earnerId: '${earnerId}', planId: '${planId}'`
		);
	}
}
