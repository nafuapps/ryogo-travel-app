ALTER TYPE "public"."driver_status" ADD VALUE 'leave' BEFORE 'inactive';--> statement-breakpoint
ALTER TYPE "public"."vehicle_status" ADD VALUE 'repair' BEFORE 'inactive';--> statement-breakpoint
ALTER TABLE "bookings" DROP CONSTRAINT "rating >=1 and rating <=5";--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "status" SET DEFAULT 'lead'::text;--> statement-breakpoint
DROP TYPE "public"."booking_status";--> statement-breakpoint
CREATE TYPE "public"."booking_status" AS ENUM('lead', 'confirmed', 'in_progress', 'completed', 'cancelled', 'reconciled');--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "status" SET DEFAULT 'lead'::"public"."booking_status";--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "status" SET DATA TYPE "public"."booking_status" USING "status"::"public"."booking_status";--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "rating_by_customer" integer;--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "remarks" text;--> statement-breakpoint
ALTER TABLE "vehicle_repairs" ADD COLUMN "cost" integer;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "driver rating >=1 and rating <=5" CHECK ("bookings"."rating_by_driver" >=1 AND "bookings"."rating_by_driver" <=5);--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "customer rating >=1 and rating <=5" CHECK ("bookings"."rating_by_customer" >=1 AND "bookings"."rating_by_customer" <=5);--> statement-breakpoint
ALTER TABLE "vehicle_repairs" ADD CONSTRAINT "cost >= 0 and < 1000000" CHECK ("vehicle_repairs"."cost" > 0 AND "vehicle_repairs"."cost" < 1000000);