ALTER TYPE "public"."payment_method"
RENAME VALUE 'upi' TO 'UPI';
--> statement-breakpoint
ALTER TYPE "public"."payment_method"
RENAME VALUE 'card' TO 'Card';
--> statement-breakpoint
ALTER TYPE "public"."payment_method"
RENAME VALUE 'net banking' TO 'Net Banking';
--> statement-breakpoint
ALTER TYPE "public"."payment_method"
RENAME VALUE 'wallet' TO 'Wallet';
--> statement-breakpoint
ALTER TYPE "public"."payment_method"
RENAME VALUE 'other' TO 'Other';
--> statement-breakpoint
ALTER TYPE "public"."vehicle_brands"
RENAME VALUE 'Maruti' TO 'Maruti Suzuki';