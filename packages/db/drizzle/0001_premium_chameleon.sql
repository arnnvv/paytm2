CREATE TABLE IF NOT EXISTS "paytm_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"expires" bigint NOT NULL
);
--> statement-breakpoint
ALTER TABLE "paytm_users" ALTER COLUMN "email" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "paytm_users" ALTER COLUMN "number" DROP NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "paytm_sessions" ADD CONSTRAINT "paytm_sessions_user_id_paytm_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."paytm_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
