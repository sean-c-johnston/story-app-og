import Stripe from 'stripe';
import { STRIPE_SECRET_KEY, STRIPE_SECRET_WEBHOOK_KEY } from '$env/static/private';

const stripe = new Stripe(STRIPE_SECRET_KEY);

const oneDayInSeconds = 24 * 60 * 60;

export async function POST({ request, locals: { supabaseServiceClient } }) {
	const body = await request.text();
	const sig = request.headers.get('Stripe-Signature') as string;

	let event: Stripe.Event;

	try {
		if (!sig || !STRIPE_SECRET_WEBHOOK_KEY) return new Response(null);

		event = stripe.webhooks.constructEvent(body, sig, STRIPE_SECRET_WEBHOOK_KEY);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (err: any) {
		console.log(`❌ Error message: ${err.message}`);
		return new Response(`Webhook Error: ${err.message}`, { status: 400 });
	}

	try {
		switch (event.type) {
			case 'customer.subscription.deleted': {
				const subscription = event.data.object;

				console.log('Subscription deleted');

				const { error } = await supabaseServiceClient
					.from('user_subscriptions')
					.update({
						subscription_expiry: new Date().toISOString(),
						status: 'canceled'
					})
					.match({
						// todo: user id too???
						stripe_customer_id: subscription.customer,
						stripe_subscription_id: subscription.id
					});
				console.log(error);

				break;
			}
			case 'invoice.paid': {
				const invoice = event.data.object;

				// subscribe, here, and cancel
				// all need to assume multiple rows and operate based on subscription id

				const subscriptionId = String(invoice.subscription);
				const subscription = await stripe.subscriptions.retrieve(subscriptionId);
				const userId = subscription.metadata['appUserId'];

				const oneDayAfterSubExpires = subscription.current_period_end + oneDayInSeconds;
				const newExpiryTimestamp = new Date(oneDayAfterSubExpires * 1000);

				const subscriptionItem = subscription.items.data[0];
				const price = subscriptionItem.price;

				const updatedData = {
					user_id: userId,
					stripe_subscription_id: subscriptionId,
					stripe_customer_id: subscription.customer,
					subscription_expiry: newExpiryTimestamp.toISOString(),
					price_id: price.id,
					status: 'active'
				};
				await supabaseServiceClient.from('user_subscriptions').upsert(updatedData);

				break;
			}
			default: {
				return new Response('', { status: 200 });
			}
		}
	} catch (error) {
		console.log(error);
		return new Response('Webhook handler failed. View your function logs.', {
			status: 400
		});
	}

	return new Response(JSON.stringify({ received: true }));
}
