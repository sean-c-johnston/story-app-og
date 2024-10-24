import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '$env/static/private';
import { redirect } from '@sveltejs/kit';

const stripe = new Stripe(STRIPE_SECRET_KEY);

export const actions = {
	createPortalSession: async ({ request, url }) => {
		// For demonstration purposes, we're using the Checkout session to retrieve the customer ID.
		// Typically, this is stored alongside the authenticated user in your database.
		// TODO: use the DB Ids
		const data = await request.formData();
		const session_id = String(data.get('session_id'));


		
		if (!session_id) {
			return;
		}
		

		const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);
		const customerId = String(checkoutSession.customer);
		
		// This is the url to which the customer will be redirected when they are done
		// managing their billing with the portal.
		// TODO: Change this? What makes sense?
		const returnUrl = url.origin;
				
		const portalParams: Stripe.BillingPortal.SessionCreateParams = {
			customer: customerId,
			return_url: returnUrl
		};
		const portalSession = await stripe.billingPortal.sessions.create(portalParams);


		redirect(303, portalSession.url);
	}
};
