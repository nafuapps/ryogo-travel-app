ALTER TABLE "missions" RENAME COLUMN "title" TO "title_key";--> statement-breakpoint
ALTER TABLE "missions" RENAME COLUMN "message" TO "message_key";--> statement-breakpoint
ALTER TABLE "notifications" RENAME COLUMN "title" TO "text_key";--> statement-breakpoint
ALTER TABLE "missions" ADD COLUMN "title_object" jsonb;--> statement-breakpoint
ALTER TABLE "missions" ADD COLUMN "message_object" jsonb;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "text_object" jsonb;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "ignoreNotifications" "entity_type"[] DEFAULT '{}';