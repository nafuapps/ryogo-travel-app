ALTER TYPE "public"."order_status"
RENAME VALUE 'authorized' TO 'attempted';
--> statement-breakpoint
ALTER TYPE "public"."order_status"
RENAME VALUE 'captured' TO 'paid';
--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM(
	'created',
	'authorized',
	'failed',
	'captured',
	'refunded'
);
--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('upi', 'card', 'netbanking', 'wallet', 'other');
--> statement-breakpoint
CREATE SEQUENCE "public"."payment_id_seq" INCREMENT BY 1 MINVALUE 1000000 MAXVALUE 9999999 START WITH 1000000 CACHE 1;
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" text PRIMARY KEY NOT NULL,
	"agency_id" text NOT NULL,
	"user_id" text NOT NULL,
	"order_id" text NOT NULL,
	"amount" integer NOT NULL,
	"razorpay_payment_id" text NOT NULL,
	"method" "payment_method" DEFAULT 'upi' NOT NULL,
	"bank_name" text,
	"card_id" text,
	"vpa" text,
	"wallet" text,
	"email" text,
	"contact" text,
	"rp_fee" integer,
	"tax" integer,
	"error_code" text,
	"error_desc" text,
	"error_source" text,
	"error_step" text,
	"error_reason" text,
	"events" text [] DEFAULT '{}' NOT NULL,
	"status" "payment_status" DEFAULT 'created' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "payments_razorpay_payment_id_unique" UNIQUE("razorpay_payment_id"),
	CONSTRAINT "amount >= 1 AND amount <= 10000" CHECK (
		"payments"."amount" >= 1
		AND "payments"."amount" <= 10000
	)
);
--> statement-breakpoint
ALTER TABLE "orders"
	RENAME COLUMN "url" TO "invoice_url";
--> statement-breakpoint
ALTER TABLE "agencies"
ADD COLUMN "latest_paid_order_id" text;
--> statement-breakpoint
ALTER TABLE "orders"
ADD COLUMN "attempts" integer;
--> statement-breakpoint
ALTER TABLE "orders"
ADD COLUMN "is_webhook_confirmed" boolean DEFAULT false NOT NULL;
--> statement-breakpoint
ALTER TABLE "payments"
ADD CONSTRAINT "payments_agency_id_agencies_id_fk" FOREIGN KEY ("agency_id") REFERENCES "public"."agencies"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "payments"
ADD CONSTRAINT "payments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "payments"
ADD CONSTRAINT "payments_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "payments_agency_idx" ON "payments" USING btree ("agency_id");
--> statement-breakpoint
CREATE INDEX "payments_user_idx" ON "payments" USING btree ("user_id");
--> statement-breakpoint
CREATE INDEX "payments_order_idx" ON "payments" USING btree ("order_id");
--> statement-breakpoint
CREATE INDEX "payments_rpPaymentId_idx" ON "payments" USING btree ("razorpay_payment_id");
--> statement-breakpoint
CREATE INDEX "payments_agency_user_idx" ON "payments" USING btree ("agency_id", "user_id");
--> statement-breakpoint
CREATE INDEX "payments_agency_status_idx" ON "payments" USING btree ("agency_id", "status");
--> statement-breakpoint
ALTER TABLE "orders"
ADD CONSTRAINT "amount >= 1 AND amount <= 10000" CHECK (
		"orders"."amount" >= 1
		AND "orders"."amount" <= 10000
	);