CREATE TYPE "public"."driver_leave_status" AS ENUM('Pending', 'Ongoing', 'Completed');--> statement-breakpoint
CREATE TYPE "public"."vehicle_repair_status" AS ENUM('Pending', 'Ongoing', 'Completed');--> statement-breakpoint
ALTER TABLE "notifications" ALTER COLUMN "is_feed" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "driver_leaves" ADD COLUMN "status" "driver_leave_status" DEFAULT 'Pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "vehicle_repairs" ADD COLUMN "status" "vehicle_repair_status" DEFAULT 'Pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "driver_leaves" DROP COLUMN "is_completed";--> statement-breakpoint
ALTER TABLE "vehicle_repairs" DROP COLUMN "is_completed";