CREATE TYPE "public"."vehicle_brands" AS ENUM(
    'Ford',
    'Honda',
    'Hyundai',
    'Kia',
    'Maruti',
    'Mahindra',
    'MG',
    'Renault',
    'Skoda',
    'Tata',
    'Toyota'
);
--> statement-breakpoint
CREATE TYPE "public"."vehicle_colors" AS ENUM(
    'Black',
    'Blue',
    'Brown',
    'Gray',
    'Green',
    'Orange',
    'Pink',
    'Purple',
    'Red',
    'Silver',
    'White',
    'Yellow'
);
--> statement-breakpoint
ALTER TABLE "drivers"
ALTER COLUMN "address" DROP NOT NULL;
--> statement-breakpoint
ALTER TABLE "drivers"
ALTER COLUMN "license_number" DROP NOT NULL;
--> statement-breakpoint
ALTER TABLE "vehicles"
ALTER COLUMN "brand"
SET DEFAULT 'Honda'::"public"."vehicle_brands";
--> statement-breakpoint
ALTER TABLE "vehicles"
ALTER COLUMN "brand"
SET DATA TYPE "public"."vehicle_brands" USING "brand"::"public"."vehicle_brands";
--> statement-breakpoint
ALTER TABLE "vehicles"
ALTER COLUMN "color"
SET DEFAULT 'White'::"public"."vehicle_colors";
--> statement-breakpoint
ALTER TABLE "vehicles"
ALTER COLUMN "color"
SET DATA TYPE "public"."vehicle_colors" USING "color"::"public"."vehicle_colors";
--> statement-breakpoint
ALTER TABLE "vehicles"
ALTER COLUMN "has_ac"
SET DEFAULT true;