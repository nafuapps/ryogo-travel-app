ALTER TABLE "bookings" ADD COLUMN "reconciled_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "bookings" DROP COLUMN "is_reconciled";