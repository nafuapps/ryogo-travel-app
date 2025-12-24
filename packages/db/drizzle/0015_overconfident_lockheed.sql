ALTER TABLE "users" DROP CONSTRAINT "last login <= now";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "last logout <= now";