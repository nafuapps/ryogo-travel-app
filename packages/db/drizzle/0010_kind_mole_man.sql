ALTER TABLE "bookings" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "status" SET DEFAULT 'lead'::text;--> statement-breakpoint
DROP TYPE "public"."booking_status";--> statement-breakpoint
CREATE TYPE "public"."booking_status" AS ENUM('lead', 'confirmed', 'in progress', 'completed', 'cancelled', 'reconciled');--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "status" SET DEFAULT 'lead'::"public"."booking_status";--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "status" SET DATA TYPE "public"."booking_status" USING "status"::"public"."booking_status";--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "type" SET DEFAULT 'one way'::text;--> statement-breakpoint
DROP TYPE "public"."booking_type";--> statement-breakpoint
CREATE TYPE "public"."booking_type" AS ENUM('one way', 'round trip', 'multi day');--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "type" SET DEFAULT 'one way'::"public"."booking_type";--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "type" SET DATA TYPE "public"."booking_type" USING "type"::"public"."booking_type";--> statement-breakpoint
ALTER TABLE "drivers" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "drivers" ALTER COLUMN "status" SET DEFAULT 'available'::text;--> statement-breakpoint
DROP TYPE "public"."driver_status";--> statement-breakpoint
CREATE TYPE "public"."driver_status" AS ENUM('available', 'on trip', 'leave', 'inactive', 'suspended');--> statement-breakpoint
ALTER TABLE "drivers" ALTER COLUMN "status" SET DEFAULT 'available'::"public"."driver_status";--> statement-breakpoint
ALTER TABLE "drivers" ALTER COLUMN "status" SET DATA TYPE "public"."driver_status" USING "status"::"public"."driver_status";--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "mode" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "mode" SET DEFAULT 'cash'::text;--> statement-breakpoint
DROP TYPE "public"."transaction_modes";--> statement-breakpoint
CREATE TYPE "public"."transaction_modes" AS ENUM('cash', 'card', 'net banking', 'upi', 'other');--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "mode" SET DEFAULT 'cash'::"public"."transaction_modes";--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "mode" SET DATA TYPE "public"."transaction_modes" USING "mode"::"public"."transaction_modes";--> statement-breakpoint
ALTER TABLE "trip_logs" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."trip_log_types";--> statement-breakpoint
CREATE TYPE "public"."trip_log_types" AS ENUM('trip started', 'trip ended', 'arrived', 'picked up', 'dropped');--> statement-breakpoint
ALTER TABLE "trip_logs" ALTER COLUMN "type" SET DATA TYPE "public"."trip_log_types" USING "type"::"public"."trip_log_types";--> statement-breakpoint
ALTER TABLE "vehicles" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "vehicles" ALTER COLUMN "status" SET DEFAULT 'available'::text;--> statement-breakpoint
DROP TYPE "public"."vehicle_status";--> statement-breakpoint
CREATE TYPE "public"."vehicle_status" AS ENUM('available', 'on trip', 'repair', 'inactive', 'suspended');--> statement-breakpoint
ALTER TABLE "vehicles" ALTER COLUMN "status" SET DEFAULT 'available'::"public"."vehicle_status";--> statement-breakpoint
ALTER TABLE "vehicles" ALTER COLUMN "status" SET DATA TYPE "public"."vehicle_status" USING "status"::"public"."vehicle_status";