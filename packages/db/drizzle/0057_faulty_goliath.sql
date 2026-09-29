ALTER TABLE "driver_leaves" ADD COLUMN "actual_start_date" date;--> statement-breakpoint
ALTER TABLE "driver_leaves" ADD COLUMN "actual_end_date" date;--> statement-breakpoint
ALTER TABLE "vehicle_repairs" ADD COLUMN "actual_start_date" date;--> statement-breakpoint
ALTER TABLE "vehicle_repairs" ADD COLUMN "actual_end_date" date;--> statement-breakpoint
ALTER TABLE "driver_leaves" ADD CONSTRAINT "actual_end_date >= actual_start_date" CHECK ("driver_leaves"."actual_end_date" >= "driver_leaves"."actual_start_date");--> statement-breakpoint
ALTER TABLE "vehicle_repairs" ADD CONSTRAINT "actual_end_date >= actual_start_date" CHECK ("vehicle_repairs"."actual_end_date" >= "vehicle_repairs"."actual_start_date");