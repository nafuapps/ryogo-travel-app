ALTER TYPE "public"."product_feedback_type" ADD VALUE 'Support' BEFORE 'Analytics';--> statement-breakpoint
ALTER TABLE "product_feedbacks" RENAME COLUMN "review" TO "liked";--> statement-breakpoint
ALTER TABLE "product_feedbacks" RENAME COLUMN "comment" TO "remarks";--> statement-breakpoint
ALTER TABLE "product_feedbacks" ALTER COLUMN "user_id" SET NOT NULL;