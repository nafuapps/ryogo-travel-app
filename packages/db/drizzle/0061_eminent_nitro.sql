ALTER TABLE "bookings" RENAME COLUMN "review_completed_by_agency_at" TO "closed_at";--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "confirmed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "actual end date >= actual start date" CHECK ("bookings"."actual_end_date" >= "bookings"."actual_start_date");--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "confirmed after creation" CHECK ("bookings"."confirmed_at" >= "bookings"."created_at");--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "started after confirmed" CHECK ("bookings"."started_at" >= "bookings"."confirmed_at");--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "completed after started" CHECK ("bookings"."completed_at" >= "bookings"."started_at");--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "cancelled after creation" CHECK ("bookings"."cancelled_at" >= "bookings"."created_at");--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "closed after completed" CHECK ("bookings"."closed_at" >= "bookings"."completed_at");--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "reconciled after closed" CHECK ("bookings"."reconciled_at" >= "bookings"."closed_at");