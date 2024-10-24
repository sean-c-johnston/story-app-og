alter table "public"."user_subscriptions" drop constraint "user_subscriptions_id_key";

alter table "public"."user_subscriptions" drop constraint "user_subscriptions_pkey";

drop index if exists "public"."user_subscriptions_id_key";

drop index if exists "public"."user_subscriptions_pkey";

alter table "public"."user_subscriptions" drop column "id";

CREATE UNIQUE INDEX user_subscriptions_pkey ON public.user_subscriptions USING btree (user_id);

alter table "public"."user_subscriptions" add constraint "user_subscriptions_pkey" PRIMARY KEY using index "user_subscriptions_pkey";


