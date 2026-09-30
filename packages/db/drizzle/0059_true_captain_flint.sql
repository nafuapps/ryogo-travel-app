ALTER TABLE "bookings" ADD COLUMN "code_sent_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "customers" DROP COLUMN "secret_code";