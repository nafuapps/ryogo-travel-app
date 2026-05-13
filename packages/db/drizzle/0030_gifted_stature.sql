CREATE TYPE "public"."order_status" AS ENUM('created', 'authorized', 'captured');--> statement-breakpoint
CREATE TYPE "public"."order_type" AS ENUM('monthly', 'quarterly', 'annual');--> statement-breakpoint
ALTER SEQUENCE "public"."invoice_id_seq" RENAME TO "order_id_seq";--> statement-breakpoint
ALTER TABLE "invoices" RENAME TO "orders";--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "invoices_agency_id_agencies_id_fk";
--> statement-breakpoint
DROP INDEX "invoices_agency_idx";--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "orderType" "order_type" DEFAULT 'monthly' NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "status" "order_status" DEFAULT 'created' NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "rp_order_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_agency_id_agencies_id_fk" FOREIGN KEY ("agency_id") REFERENCES "public"."agencies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "orders_agency_idx" ON "orders" USING btree ("agency_id");--> statement-breakpoint
CREATE INDEX "orders_rpOrderId_idx" ON "orders" USING btree ("rp_order_id");--> statement-breakpoint
CREATE INDEX "orders_agency_user_idx" ON "orders" USING btree ("agency_id","user_id");--> statement-breakpoint
CREATE INDEX "orders_agency_status_idx" ON "orders" USING btree ("agency_id","status");--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_rp_order_id_unique" UNIQUE("rp_order_id");--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "amount >= 0 AND amount <= 50000" CHECK ("orders"."amount" >= 0 AND "orders"."amount" <= 50000);