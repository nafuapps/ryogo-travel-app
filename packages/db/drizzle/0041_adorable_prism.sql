CREATE TYPE "public"."product_feedback_type" AS ENUM('onboarding', 'new booking', 'new customer', 'new driver', 'new vehicle', 'new order');--> statement-breakpoint
CREATE SEQUENCE "public"."product_feedback_id_seq" INCREMENT BY 1 MINVALUE 1000000 MAXVALUE 9999999 START WITH 1000000 CACHE 1;--> statement-breakpoint
CREATE TABLE "product_feedbacks" (
	"id" text PRIMARY KEY NOT NULL,
	"agency_id" text NOT NULL,
	"user_id" text,
	"entity_id" text,
	"feedback_type" "product_feedback_type" NOT NULL,
	"rating" integer,
	"review" boolean,
	"comment" varchar(300),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "rating >=1 and rating <=5" CHECK ("product_feedbacks"."rating" >=1 AND "product_feedbacks"."rating" <=5)
);
--> statement-breakpoint
ALTER TABLE "bookings" RENAME COLUMN "total_distance" TO "estimated_total_distance";--> statement-breakpoint
ALTER TABLE "bookings" RENAME COLUMN "total_ac_charge" TO "estimated_total_ac_charge";--> statement-breakpoint
ALTER TABLE "bookings" RENAME COLUMN "total_vehicle_rate" TO "estimated_total_vehicle_rate";--> statement-breakpoint
ALTER TABLE "bookings" RENAME COLUMN "total_driver_allowance" TO "estimated_total_driver_allowance";--> statement-breakpoint
ALTER TABLE "bookings" RENAME COLUMN "total_commission" TO "estimated_commission_amount";--> statement-breakpoint
ALTER TABLE "bookings" RENAME COLUMN "total_amount" TO "estimated_total_amount";--> statement-breakpoint
ALTER TABLE "bookings" DROP CONSTRAINT "total_amount >= 1 and <= 1000000";--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "actual_start_date" date;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "actual_end_date" date;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "actual_total_distance" integer;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "actual_total_ac_charge" integer;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "actual_total_vehicle_rate" integer;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "actual_total_driver_allowance" integer;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "actual_commission_amount" integer;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "actual_total_amount" integer;--> statement-breakpoint
ALTER TABLE "product_feedbacks" ADD CONSTRAINT "product_feedbacks_agency_id_agencies_id_fk" FOREIGN KEY ("agency_id") REFERENCES "public"."agencies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_feedbacks" ADD CONSTRAINT "product_feedbacks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "product_feedbacks_agency_idx" ON "product_feedbacks" USING btree ("agency_id");--> statement-breakpoint
CREATE INDEX "product_feedbacks_user_idx" ON "product_feedbacks" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "product_feedbacks_type_idx" ON "product_feedbacks" USING btree ("feedback_type");--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "estimated_total_amount >= 1 and <= 1000000" CHECK ("bookings"."estimated_total_amount" >= 1 AND "bookings"."estimated_total_amount" <= 1000000);--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "actual_total_amount >= 1 and <= 1000000" CHECK ("bookings"."actual_total_amount" >= 1 AND "bookings"."actual_total_amount" <= 1000000);