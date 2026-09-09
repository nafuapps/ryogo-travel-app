ALTER TYPE "public"."vehicle_brands" ADD VALUE 'Bajaj' BEFORE 'Ford';--> statement-breakpoint
ALTER TYPE "public"."vehicle_brands" ADD VALUE 'Hero' BEFORE 'Honda';--> statement-breakpoint
ALTER TYPE "public"."vehicle_brands" ADD VALUE 'TVS';--> statement-breakpoint
ALTER TYPE "public"."vehicle_brands" ADD VALUE 'Other';--> statement-breakpoint
ALTER TABLE "bookings" DROP CONSTRAINT "passengers >= 0 and <= 100";--> statement-breakpoint
ALTER TABLE "drivers" ADD COLUMN "added_by_user_id" text DEFAULT 'U1000006' NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "ip_address" varchar(30);--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "user_agent" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "lat_long" varchar(50);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "located_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "location" geometry(point);--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "added_by_user_id" text DEFAULT 'U1000006' NOT NULL;--> statement-breakpoint
ALTER TABLE "drivers" ADD CONSTRAINT "drivers_added_by_user_id_users_id_fk" FOREIGN KEY ("added_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_added_by_user_id_users_id_fk" FOREIGN KEY ("added_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "passengers > 0 and <= 100" CHECK ("bookings"."passengers" > 0 AND "bookings"."passengers" <= 100);--> statement-breakpoint
ALTER TABLE "drivers" ADD CONSTRAINT "can_drive_atleast_one_vehicle_type" CHECK (array_length("drivers"."canDriveVehicleTypes", 1) > 0);