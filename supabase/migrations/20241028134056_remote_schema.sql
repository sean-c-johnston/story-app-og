alter table "public"."user_subscriptions" add column "status" text not null default 'active'::text;

create policy "Enable users to view their own data only"
on "public"."user_subscriptions"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



