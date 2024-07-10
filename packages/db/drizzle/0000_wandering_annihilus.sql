DO $$ BEGIN
 CREATE TYPE "public"."authEnum" AS ENUM('Google', 'Github');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."onRampStatusEnum" AS ENUM('Success', 'Failure', 'Processing');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "paytm_balance" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"amount" integer NOT NULL,
	"locked" integer NOT NULL,
	CONSTRAINT "paytm_balance_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "paytm_merchant" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar,
	"name" varchar,
	"authEnum" "authEnum" NOT NULL,
	CONSTRAINT "paytm_merchant_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "paytm_onramp_transaction" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"onRampStatusEnum" "onRampStatusEnum" NOT NULL,
	"token" varchar NOT NULL,
	"provider" varchar NOT NULL,
	"amount" integer NOT NULL,
	"start_time" timestamp NOT NULL,
	"user_id" uuid NOT NULL,
	CONSTRAINT "paytm_onramp_transaction_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "paytm_p2p_transfer" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"amount" integer NOT NULL,
	"timestamp" timestamp NOT NULL,
	"from_user_id" uuid NOT NULL,
	"to_user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "paytm_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar,
	"email" varchar,
	"number" varchar NOT NULL,
	"password" varchar NOT NULL,
	CONSTRAINT "paytm_users_email_unique" UNIQUE("email"),
	CONSTRAINT "paytm_users_number_unique" UNIQUE("number")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "paytm_balance" ADD CONSTRAINT "paytm_balance_user_id_paytm_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."paytm_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "paytm_onramp_transaction" ADD CONSTRAINT "paytm_onramp_transaction_user_id_paytm_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."paytm_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "paytm_p2p_transfer" ADD CONSTRAINT "paytm_p2p_transfer_from_user_id_paytm_users_id_fk" FOREIGN KEY ("from_user_id") REFERENCES "public"."paytm_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "paytm_p2p_transfer" ADD CONSTRAINT "paytm_p2p_transfer_to_user_id_paytm_users_id_fk" FOREIGN KEY ("to_user_id") REFERENCES "public"."paytm_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
