ALTER TABLE "expenses" ADD COLUMN "expense_date" date DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "transaction_date" timestamp DEFAULT now() NOT NULL;