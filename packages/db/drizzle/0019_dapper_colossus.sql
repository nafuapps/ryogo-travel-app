ALTER TABLE "customers" DROP CONSTRAINT "driver_ratings_between_1_and_5";
--> statement-breakpoint
ALTER TABLE "drivers" DROP CONSTRAINT "customer_ratings_between_1_and_5";
--> statement-breakpoint
ALTER TABLE "vehicles" DROP CONSTRAINT "customer_ratings_between_1_and_5";
--> statement-breakpoint
ALTER TABLE "bookings"
ALTER COLUMN "status"
SET DATA TYPE text;
--> statement-breakpoint
ALTER TABLE "bookings"
ALTER COLUMN "status"
SET DEFAULT 'lead'::text;
--> statement-breakpoint
DROP TYPE "public"."booking_status";
--> statement-breakpoint
CREATE TYPE "public"."booking_status" AS ENUM(
    'lead',
    'confirmed',
    'in progress',
    'completed',
    'cancelled'
);
--> statement-breakpoint
ALTER TABLE "bookings"
ALTER COLUMN "status"
SET DEFAULT 'lead'::"public"."booking_status";
--> statement-breakpoint
ALTER TABLE "bookings"
ALTER COLUMN "status"
SET DATA TYPE "public"."booking_status" USING "status"::"public"."booking_status";
--> statement-breakpoint
ALTER TABLE "bookings"
ADD COLUMN "is_reconciled" boolean DEFAULT false NOT NULL;
--> statement-breakpoint
ALTER TABLE "vehicles"
ADD COLUMN "rc_expires_on" date;
--> statement-breakpoint
ALTER TABLE "customers"
ADD CONSTRAINT "driver_ratings_between_1_and_5" CHECK (
        "customers"."driver_ratings" IS NULL
        OR "customers"."driver_ratings" <@ ARRAY [1,2,3,4,5]::int []
    );
--> statement-breakpoint
ALTER TABLE "drivers"
ADD CONSTRAINT "customer_ratings_between_1_and_5" CHECK (
        "drivers"."customer_ratings" IS NULL
        OR "drivers"."customer_ratings" <@ ARRAY [1,2,3,4,5]::int []
    );
--> statement-breakpoint
ALTER TABLE "vehicles"
ADD CONSTRAINT "customer_ratings_between_1_and_5" CHECK (
        "vehicles"."customer_ratings" IS NULL
        OR "vehicles"."customer_ratings" <@ ARRAY [1,2,3,4,5]::int []
    );