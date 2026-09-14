ALTER TABLE "bookings"
ADD COLUMN "started_at" timestamp with time zone;
--> statement-breakpoint
ALTER TYPE "public"."order_type"
RENAME VALUE 'Monthtly' TO 'Monthly';
--> statement-breakpoint
ALTER TABLE "vehicles"
ALTER COLUMN "added_by_user_id" DROP DEFAULT;
ALTER TABLE "drivers"
ALTER COLUMN "added_by_user_id" DROP DEFAULT;