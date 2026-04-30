ALTER TABLE "bookings" ADD COLUMN "confirmation_sent_on" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "confirmation_url" text;