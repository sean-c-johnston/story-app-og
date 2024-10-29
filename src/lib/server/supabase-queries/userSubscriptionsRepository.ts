import { createServerClient } from '@supabase/ssr';
import type { Database } from '../../../../database.types';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SECRET_API_KEY } from '$env/static/private';
import type { User } from '@supabase/supabase-js';

const subscriptionStatus = {
	active: 'active',
	canceled: 'canceled'
};

const serverSupabaseClient = createServerClient<Database>(
	PUBLIC_SUPABASE_URL,
	SUPABASE_SECRET_API_KEY,
	{ cookies: { getAll: () => [] } }
);

export const userSubscriptionsRepository = {
	cancel: async (stripe_customer_id: string, stripe_subscription_id: string) => {
		const { data, error } = await serverSupabaseClient
			.from('user_subscriptions')
			.update({
				subscription_expiry: new Date().toISOString(),
				status: subscriptionStatus.canceled
			})
			.match({
				stripe_customer_id,
				stripe_subscription_id
			});

		return { data, error };
	},
	upsertActive: async ({
		userId,
		subscriptionId,
		customerId,
		subscriptionExpiry,
		priceId
	}: {
		userId: string;
		subscriptionId: string;
		customerId: string;
		subscriptionExpiry: Date;
		priceId: string;
	}) => {
		const updatedData = {
			user_id: userId,
			stripe_subscription_id: subscriptionId,
			stripe_customer_id: customerId,
			price_id: priceId,
			subscription_expiry: subscriptionExpiry.toISOString(),
			status: subscriptionStatus.active
		};

		const { data, error } = await serverSupabaseClient
			.from('user_subscriptions')
			.upsert(updatedData);

		if (error) {
			console.error('Error updating user subscription:', error);
		}

		return { data, error };
	},
	userHasActiveSubscription: async (user: User) => {
		if (!user) return false;

		const { count } = await serverSupabaseClient
			.from('user_subscriptions')
			.select('stripe_subscription_id', { count: 'exact', head: true })
			.eq('user_id', user.id)
			.gte('subscription_expiry', new Date().toISOString())
			.eq('status', subscriptionStatus.active);

		const numberOfResults = count ?? 0;

		if (numberOfResults > 1) {
			console.warn('Multiple active subscriptions for:', user.email, `(${user.id})`);
		}

		return numberOfResults > 0;
	}
};
