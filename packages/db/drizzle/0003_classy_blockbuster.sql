ALTER TYPE "public"."transaction_modes" ADD VALUE 'net_banking' BEFORE 'upi';--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "type" SET DEFAULT 'oneWay'::text;--> statement-breakpoint
DROP TYPE "public"."booking_type";--> statement-breakpoint
CREATE TYPE "public"."booking_type" AS ENUM('oneWay', 'round', 'multiDay');--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "type" SET DEFAULT 'oneWay'::"public"."booking_type";--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "type" SET DATA TYPE "public"."booking_type" USING "type"::"public"."booking_type";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT 'new'::text;--> statement-breakpoint
DROP TYPE "public"."user_status";--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('new', 'active', 'expired', 'suspended');--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT 'new'::"public"."user_status";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "status" SET DATA TYPE "public"."user_status" USING "status"::"public"."user_status";--> statement-breakpoint
ALTER TABLE "expenses" ALTER COLUMN "type" SET DEFAULT 'other';--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "type" SET DEFAULT 'credit';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "status" SET DATA TYPE "public"."user_status" USING "status"::text::"public"."user_status";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT 'new';