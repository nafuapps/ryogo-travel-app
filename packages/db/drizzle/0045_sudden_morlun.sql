ALTER TYPE "public"."trip_log_types" ADD VALUE 'other';--> statement-breakpoint
ALTER TABLE "bookings" DROP CONSTRAINT "rate per km >= 1 and <= 100";--> statement-breakpoint
ALTER TABLE "bookings" DROP CONSTRAINT "estimated_total_amount >= 1 and <= 1000000";--> statement-breakpoint
ALTER TABLE "bookings" DROP CONSTRAINT "actual_total_amount >= 1 and <= 1000000";--> statement-breakpoint
ALTER TABLE "trip_logs" ALTER COLUMN "odometer_reading" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "rate per km >= 0 and <= 100" CHECK ("bookings"."rate_per_km" >= 0 AND "bookings"."rate_per_km" <= 100);--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "estimated_total_amount >= 0 and <= 1000000" CHECK ("bookings"."estimated_total_amount" >= 0 AND "bookings"."estimated_total_amount" <= 1000000);--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "actual_total_amount >= 0 and <= 1000000" CHECK ("bookings"."actual_total_amount" >= 0 AND "bookings"."actual_total_amount" <= 1000000);