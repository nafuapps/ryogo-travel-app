ALTER TABLE "users" ALTER COLUMN "isAdmin" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "isVerified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "verification_code" varchar(6) DEFAULT '123456' NOT NULL;