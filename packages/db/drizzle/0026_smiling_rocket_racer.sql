ALTER TABLE "vehicles" DROP CONSTRAINT "rate per km > 0 and < 100";--> statement-breakpoint
ALTER TABLE "vehicles" DROP CONSTRAINT "ac charge < 10000";--> statement-breakpoint
ALTER TABLE "trip_logs" ADD COLUMN "location" geometry(point);--> statement-breakpoint
CREATE INDEX "trip_logs_spatial_index" ON "trip_logs" USING gist ("location");--> statement-breakpoint
ALTER TABLE "vehicles" ADD CONSTRAINT "rate per km >= 0 and < 100" CHECK ("vehicles"."default_rate_per_km" >= 0 AND "vehicles"."default_rate_per_km" < 100);--> statement-breakpoint
ALTER TABLE "vehicles" ADD CONSTRAINT "ac charge >= 0 and < 10000" CHECK ("vehicles"."extra_ac_charge_per_day" >= 0 AND "vehicles"."extra_ac_charge_per_day" < 10000);