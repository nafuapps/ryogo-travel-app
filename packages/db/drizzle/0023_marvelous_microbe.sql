ALTER TABLE "bookings" DROP CONSTRAINT "commission_rate >= 0 AND commission_rate <= 100";--> statement-breakpoint
ALTER TABLE "bookings" DROP CONSTRAINT "passengers >= 0 and < 100";--> statement-breakpoint
ALTER TABLE "bookings" DROP CONSTRAINT "ac charge per day  < 10000";--> statement-breakpoint
ALTER TABLE "bookings" DROP CONSTRAINT "rate per km > 0 and < 100";--> statement-breakpoint
ALTER TABLE "bookings" DROP CONSTRAINT "allowance >= 0 and allowance < 10000";--> statement-breakpoint
ALTER TABLE "bookings" DROP CONSTRAINT "total_amount > 0 and < 1000000";--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "city_distance" SET DEFAULT 1;--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "total_distance" SET DEFAULT 1;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "quote_sent_on" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "quote_url" text;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "invoice_sent_on" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "invoice_url" text;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "commission_rate >= 0 and <= 100" CHECK ("bookings"."commission_rate" >= 0 AND "bookings"."commission_rate" <= 100);--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "distance >= 1 and <= 5000" CHECK ("bookings"."city_distance" >= 1 AND "bookings"."city_distance" <= 5000);--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "passengers >= 0 and <= 100" CHECK ("bookings"."passengers" >= 0 AND "bookings"."passengers" <= 100);--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "ac charge per day >=0 and <= 10000" CHECK ("bookings"."ac_charge_per_day" >= 0 AND "bookings"."ac_charge_per_day" <= 10000);--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "rate per km >= 1 and <= 100" CHECK ("bookings"."rate_per_km" >= 1 AND "bookings"."rate_per_km" <= 100);--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "allowance >= 0 and allowance <= 10000" CHECK ("bookings"."allowance_per_day" >= 0 AND "bookings"."allowance_per_day" <= 10000);--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "total_amount >= 1 and <= 1000000" CHECK ("bookings"."total_amount" >= 1 AND "bookings"."total_amount" <= 1000000);