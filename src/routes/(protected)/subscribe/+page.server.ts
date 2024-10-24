import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '$env/static/private';
import { redirect } from '@sveltejs/kit';

const stripe = new Stripe(STRIPE_SECRET_KEY);

// export const load: PageServerLoad = async ({locals: { supabase }}) => {
//
// }

export const actions = {
	createCheckoutSession: async ({ request, url, locals: { safeGetSession } }) => {
		const { user } = await safeGetSession();

		const { data: matchingCustomers } = await stripe.customers.list({ email: user.email });
		const existingStripeCustomer = matchingCustomers?.[0];

		if (matchingCustomers.length > 1) {
			console.warn('Multiple customers found for email: ', user.email);
		}

		const data = await request.formData();
		const lookup_key = String(data.get('lookup_key'));
		const prices = await stripe.prices.list({
			lookup_keys: [lookup_key],
			expand: ['data.product']
		});

		const checkoutSessionMetadata = {
			appUserId: user.id
		};

		const checkoutSessionParams: Stripe.Checkout.SessionCreateParams = {
			mode: 'subscription',
			line_items: [
				{
					price: prices.data[0].id,
					quantity: 1
				}
			],
			billing_address_collection: 'auto',
			allow_promotion_codes: true,
			saved_payment_method_options: {
				payment_method_save: 'enabled'
			},
			metadata: checkoutSessionMetadata,
			subscription_data: {
				metadata: checkoutSessionMetadata
			},
			success_url: `${url.origin}/subscribe/success/?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${url.origin}/subscribe/`
		};

		if (existingStripeCustomer) {
			checkoutSessionParams.customer = existingStripeCustomer.id;
		} else {
			checkoutSessionParams.customer_email = user.email;
		}

		const session = await stripe.checkout.sessions.create(checkoutSessionParams);

		redirect(303, session.url ?? url.origin);
	}
};
