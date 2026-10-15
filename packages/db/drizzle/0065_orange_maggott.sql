ALTER TABLE "transactions"
ALTER COLUMN "type"
SET DATA TYPE text;
--> statement-breakpoint
UPDATE "transactions"
SET "type" = 'Received payment from customer'
WHERE "type" = 'Credit'
    AND "otherParty" = 'Customer';
--> statement-breakpoint
UPDATE "transactions"
SET "type" = 'Sent to customer'
WHERE "type" = 'Debit'
    AND "otherParty" = 'Customer';
--> statement-breakpoint
UPDATE "transactions"
SET "type" = 'Received from driver'
WHERE "type" = 'Credit'
    AND "otherParty" = 'Driver';
--> statement-breakpoint
UPDATE "transactions"
SET "type" = 'Payout to driver'
WHERE "type" = 'Debit'
    AND "otherParty" = 'Driver';
--> statement-breakpoint
ALTER TABLE "transactions"
ALTER COLUMN "type"
SET DEFAULT 'Received payment from customer'::text;
--> statement-breakpoint
DROP TYPE "public"."transaction_types";
--> statement-breakpoint
CREATE TYPE "public"."transaction_types" AS ENUM(
    'Received payment from customer',
    'Sent to customer',
    'Customer handed to driver',
    'Driver handed to customer',
    'Received from driver',
    'Payout to driver'
);
--> statement-breakpoint
ALTER TABLE "transactions"
ALTER COLUMN "type"
SET DEFAULT 'Received payment from customer'::"public"."transaction_types";
--> statement-breakpoint
ALTER TABLE "transactions"
ALTER COLUMN "type"
SET DATA TYPE "public"."transaction_types" USING "type"::"public"."transaction_types";
--> statement-breakpoint
ALTER TABLE "expenses"
ADD COLUMN "is_paid_by_driver" boolean DEFAULT false NOT NULL;
--> statement-breakpoint
DROP INDEX "transactions_booking_party_idx";
--> statement-breakpoint
ALTER TABLE "transactions" DROP COLUMN "otherParty";
--> statement-breakpoint
DROP TYPE "public"."transaction_parties";