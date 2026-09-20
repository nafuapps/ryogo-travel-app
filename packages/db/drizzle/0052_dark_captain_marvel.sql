ALTER TABLE "locations"
    RENAME COLUMN "location" TO "geolocation";
--> statement-breakpoint
ALTER TABLE "trip_logs"
    RENAME COLUMN "location" TO "geolocation";
--> statement-breakpoint
ALTER TABLE "users"
    RENAME COLUMN "location" TO "geolocation";
--> statement-breakpoint
DROP INDEX "locations_spatial_idx";
--> statement-breakpoint
DROP INDEX "trip_logs_spatial_index";
--> statement-breakpoint
ALTER TABLE "drivers"
ALTER COLUMN "added_by_user_id" DROP DEFAULT;
--> statement-breakpoint
ALTER TABLE "vehicles"
ALTER COLUMN "added_by_user_id" DROP DEFAULT;
--> statement-breakpoint
ALTER TABLE "drivers"
ADD COLUMN "lat_long" varchar(50);
--> statement-breakpoint
ALTER TABLE "drivers"
ADD COLUMN "located_at" timestamp with time zone;
--> statement-breakpoint
ALTER TABLE "drivers"
ADD COLUMN "geolocation" geometry(point);
--> statement-breakpoint
ALTER TABLE "vehicles"
ADD COLUMN "lat_long" varchar(50);
--> statement-breakpoint
ALTER TABLE "vehicles"
ADD COLUMN "located_at" timestamp with time zone;
--> statement-breakpoint
ALTER TABLE "vehicles"
ADD COLUMN "geolocation" geometry(point);
--> statement-breakpoint
CREATE UNIQUE INDEX "idx_only_one_admin" ON "users" USING btree ("isAdmin", "agency_id")
WHERE "users"."isAdmin" = true;
--> statement-breakpoint
CREATE INDEX "users_spatial_idx" ON "users" USING gist ("geolocation");
--> statement-breakpoint
CREATE INDEX "vehicles_spatial_idx" ON "vehicles" USING gist ("geolocation");
--> statement-breakpoint
CREATE INDEX "drivers_spatial_idx" ON "drivers" USING gist ("geolocation");
--> statement-breakpoint
CREATE INDEX "locations_spatial_idx" ON "locations" USING gist ("geolocation");
--> statement-breakpoint
CREATE INDEX "trip_logs_spatial_index" ON "trip_logs" USING gist ("geolocation");