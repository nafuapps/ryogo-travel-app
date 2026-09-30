ALTER TABLE "bookings" ADD COLUMN "secret_code" varchar(6);--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "secret_code" varchar(8);