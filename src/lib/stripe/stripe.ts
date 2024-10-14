import Stripe from 'stripe';
import { PRIVATE_STRIPE_SECRET_KEY } from '$env/static/private';

export const stripe = new Stripe(PRIVATE_STRIPE_SECRET_KEY, {
	apiVersion: '2024-06-20'
});
