ALTER TABLE "bookings" DROP CONSTRAINT "passengers > 0 and < 100";--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "pickup_address" varchar(300);--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "drop_address" varchar(300);--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "passengers >= 0 and < 100" CHECK ("bookings"."passengers" >= 0 AND "bookings"."passengers" < 100);