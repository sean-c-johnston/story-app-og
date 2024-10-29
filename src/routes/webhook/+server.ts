import Stripe from 'stripe';
import { STRIPE_SECRET_KEY, STRIPE_SECRET_WEBHOOK_KEY } from '$env/static/private';
import { userSubscriptionsRepository } from '$lib/server/supabase-queries/userSubscriptionsRepository';

const stripe = new Stripe(STRIPE_SECRET_KEY);

export async function POST({ request }) {
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
				const { customer, id: subscriptionId } = event.data.object;
				const customerId = typeof customer === 'string' ? customer : customer.id;

				console.log(
					`Subscription ${subscriptionId} / ${customerId} ended, setting status to canceled`
				);

				const { error } = await userSubscriptionsRepository.cancel(customerId, subscriptionId);

				if (error) console.error(error);

				break;
			}
			case 'invoice.paid': {
				const invoice = event.data.object;

				const subscriptionId = String(invoice.subscription);
				const subscription = await stripe.subscriptions.retrieve(subscriptionId);

				const userId = subscription.metadata['appUserId'];
				const customerId =
					typeof subscription.customer === 'string'
						? subscription.customer
						: subscription.customer.id;

				const oneDay = 24 * 60 * 60;
				const oneDayAfterSubExpires = subscription.current_period_end + oneDay;
				const newExpiry = new Date(oneDayAfterSubExpires * 1000);

				const subscriptionItem = subscription.items.data[0];
				const price = subscriptionItem.price;

				await userSubscriptionsRepository.upsertActive({
					userId,
					subscriptionId,
					customerId,
					subscriptionExpiry: newExpiry,
					priceId: price.id
				});

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
