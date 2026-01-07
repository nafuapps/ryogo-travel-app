ALTER TABLE "bookings" DROP CONSTRAINT "rate per km > 0 and < 50";--> statement-breakpoint
ALTER TABLE "vehicles" DROP CONSTRAINT "rate per km > 0 and < 50";--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "rate per km > 0 and < 100" CHECK ("bookings"."rate_per_km" > 0 AND "bookings"."rate_per_km" < 100);--> statement-breakpoint
ALTER TABLE "vehicles" ADD CONSTRAINT "rate per km > 0 and < 100" CHECK ("vehicles"."default_rate_per_km" > 0 AND "vehicles"."default_rate_per_km" < 100);