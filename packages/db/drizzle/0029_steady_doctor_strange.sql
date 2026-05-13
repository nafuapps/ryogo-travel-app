ALTER TABLE "agencies" ALTER COLUMN "subscriptionPlan" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "agencies" ALTER COLUMN "subscriptionPlan" SET DEFAULT 'basic'::text;--> statement-breakpoint
DROP TYPE "public"."subscription_plan";--> statement-breakpoint
CREATE TYPE "public"."subscription_plan" AS ENUM('basic', 'premium');--> statement-breakpoint
ALTER TABLE "agencies" ALTER COLUMN "subscriptionPlan" SET DEFAULT 'basic'::"public"."subscription_plan";--> statement-breakpoint
ALTER TABLE "agencies" ALTER COLUMN "subscriptionPlan" SET DATA TYPE "public"."subscription_plan" USING "subscriptionPlan"::"public"."subscription_plan";