ALTER TABLE "drivers" ADD COLUMN "visiting_location_id" text;--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "visiting_location_id" text;--> statement-breakpoint
ALTER TABLE "drivers" ADD CONSTRAINT "drivers_visiting_location_id_locations_id_fk" FOREIGN KEY ("visiting_location_id") REFERENCES "public"."locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_visiting_location_id_locations_id_fk" FOREIGN KEY ("visiting_location_id") REFERENCES "public"."locations"("id") ON DELETE no action ON UPDATE no action;