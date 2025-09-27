CREATE TYPE "public"."user_langs" AS ENUM('en', 'hi', 'as');--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "userRole" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "userRole" SET DEFAULT 'agent'::text;--> statement-breakpoint
DROP TYPE "public"."user_roles";--> statement-breakpoint
CREATE TYPE "public"."user_roles" AS ENUM('agent', 'owner', 'driver');--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "userRole" SET DEFAULT 'agent'::"public"."user_roles";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "userRole" SET DATA TYPE "public"."user_roles" USING "userRole"::"public"."user_roles";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT 'new'::text;--> statement-breakpoint
DROP TYPE "public"."user_status";--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('new', 'active', 'inactive', 'suspended');--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT 'new'::"public"."user_status";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "status" SET DATA TYPE "public"."user_status" USING "status"::"public"."user_status";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "isAdmin" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "prefersDarkTheme" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "languagePref" "user_langs" DEFAULT 'en' NOT NULL;