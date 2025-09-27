ALTER TABLE "drivers" ALTER COLUMN "license_expires_on" SET DATA TYPE date;--> statement-breakpoint
ALTER TABLE "vehicles" ALTER COLUMN "insurance_expires_on" SET DATA TYPE date;--> statement-breakpoint
ALTER TABLE "vehicles" ALTER COLUMN "puc_expires_on" SET DATA TYPE date;