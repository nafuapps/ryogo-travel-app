ALTER TABLE "customers" ADD COLUMN "driver_ratings" integer[];--> statement-breakpoint
ALTER TABLE "drivers" ADD COLUMN "customer_ratings" integer[];--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "customer_ratings" integer[];--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "driver_ratings_between_1_and_5" CHECK (
  "customers"."driver_ratings" IS NULL OR "customers"."driver_ratings" <@ ARRAY[1,2,3,4,5]::int[]
);--> statement-breakpoint
ALTER TABLE "drivers" ADD CONSTRAINT "customer_ratings_between_1_and_5" CHECK (
  "drivers"."customer_ratings" IS NULL OR "drivers"."customer_ratings" <@ ARRAY[1,2,3,4,5]::int[]
);--> statement-breakpoint
ALTER TABLE "vehicles" ADD CONSTRAINT "customer_ratings_between_1_and_5" CHECK (
  "vehicles"."customer_ratings" IS NULL OR "vehicles"."customer_ratings" <@ ARRAY[1,2,3,4,5]::int[]
);