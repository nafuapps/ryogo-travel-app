DROP INDEX "agencies_phone_email_idx";--> statement-breakpoint
DROP INDEX "customers_agency_phone_idx";--> statement-breakpoint
DROP INDEX "drivers_agency_phone_idx";--> statement-breakpoint
DROP INDEX "drivers_user_idx";--> statement-breakpoint
DROP INDEX "locations_city_state_idx";--> statement-breakpoint
DROP INDEX "routes_source_destination_idx";--> statement-breakpoint
DROP INDEX "vehicles_agency_vehicle_number_idx";--> statement-breakpoint
ALTER TABLE "expenses" ALTER COLUMN "booking_id" SET NOT NULL;