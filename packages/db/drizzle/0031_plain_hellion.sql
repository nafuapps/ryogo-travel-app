ALTER TABLE "payments" RENAME COLUMN "razorpay_payment_id" TO "rp_payment_id";--> statement-breakpoint
ALTER TABLE "payments" DROP CONSTRAINT "payments_razorpay_payment_id_unique";--> statement-breakpoint
DROP INDEX "payments_rpPaymentId_idx";--> statement-breakpoint
CREATE INDEX "payments_rpPaymentId_idx" ON "payments" USING btree ("rp_payment_id");--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_rp_payment_id_unique" UNIQUE("rp_payment_id");