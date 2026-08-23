ALTER TABLE "orders" RENAME COLUMN "invoice_url" TO "order_invoice_url";--> statement-breakpoint
ALTER TABLE "orders" RENAME COLUMN "email_sent_at" TO "order_email_sent_at";--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "review_completed_by_agency_at" timestamp with time zone;