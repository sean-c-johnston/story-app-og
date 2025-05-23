import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createServerClient } from '@supabase/ssr';
import { type Handle, redirect } from '@sveltejs/kit';
import type { Database } from '../database.types';
import { SUPABASE_SECRET_API_KEY } from '$env/static/private';
import { userSubscriptionsRepository } from '$lib/server/supabase-queries/userSubscriptionsRepository';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient<Database>(
		PUBLIC_SUPABASE_URL,
		PUBLIC_SUPABASE_ANON_KEY,
		{
			cookies: {
				getAll: () => event.cookies.getAll(),
				setAll: (cookiesToSet) => {
					cookiesToSet.forEach(({ name, value, options }) => {
						event.cookies.set(name, value, { ...options, path: '/' });
					});
				}
			}
		}
	);

	// event.locals.supabaseServiceClient = createServerClient<Database>(
	// 	PUBLIC_SUPABASE_URL,
	// 	SUPABASE_SECRET_API_KEY,
	// 	{ cookies: { getAll: () => [] } }
	// );

	/**
	 * Unlike `supabase.auth.getSession()`, which returns the session _without_
	 * validating the JWT, this function also calls `getUser()` to validate the
	 * JWT before returning the session.
	 */
	event.locals.safeGetSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();

		if (!session) {
			return { session: null, user: null };
		}

		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();

		if (error) {
			// JWT validation has failed
			return { session: null, user: null };
		}

		return { session, user };
	};

	const { user } = await event.locals.safeGetSession();
	if (!user && routeRequiresLogin(event.route.id)) {
		redirect(307, '/auth');
	}

	const userIsSubscribed = await userSubscriptionsRepository.userHasActiveSubscription(user);
	if (!userIsSubscribed && routeRequiresSubscription(event.route.id)) {
		redirect(307, '/subscribe');
	}

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};

function routeRequiresLogin(routeId: string | null) {
	const route = routeId || '';
	return route.startsWith('/(protected)');
}

function routeRequiresSubscription(routeId: string | null) {
	const route = routeId || '';
	return route.includes('/(paid)');
}
