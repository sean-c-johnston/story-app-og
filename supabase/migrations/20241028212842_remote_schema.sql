alter table "public"."user_subscriptions" drop constraint "user_subscriptions_user_id_key";

alter table "public"."user_subscriptions" drop constraint "user_subscriptions_pkey";

drop index if exists "public"."user_subscriptions_user_id_key";

drop index if exists "public"."user_subscriptions_pkey";

alter table "public"."user_subscriptions" add column "stripe_subscription_id" text not null;

alter table "public"."user_subscriptions" alter column "price_id" set not null;

alter table "public"."user_subscriptions" alter column "stripe_customer_id" set not null;

alter table "public"."user_subscriptions" alter column "subscription_expiry" set not null;

CREATE UNIQUE INDEX user_subscriptions_pkey ON public.user_subscriptions USING btree (stripe_subscription_id);

alter table "public"."user_subscriptions" add constraint "user_subscriptions_pkey" PRIMARY KEY using index "user_subscriptions_pkey";

create policy "Allow users to update their own subscriptions"
on "public"."user_subscriptions"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));



