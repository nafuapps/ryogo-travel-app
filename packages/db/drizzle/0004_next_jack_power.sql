ALTER SEQUENCE "public"."vehicle_service_id_seq" RENAME TO "vehicle_repair_id_seq";--> statement-breakpoint
ALTER TABLE "vehicle_services" RENAME TO "vehicle_repairs";--> statement-breakpoint
ALTER TABLE "expenses" RENAME COLUMN "photo_url" TO "expense_photo_url";--> statement-breakpoint
ALTER TABLE "transactions" RENAME COLUMN "photos_url" TO "transaction_photo_url";--> statement-breakpoint
ALTER TABLE "trip_logs" RENAME COLUMN "photo_url" TO "trip_log_photo_url";--> statement-breakpoint
ALTER TABLE "vehicles" RENAME COLUMN "doc_url" TO "insurance_photo_url";--> statement-breakpoint
ALTER TABLE "vehicle_repairs" DROP CONSTRAINT "end_date >= start_date";--> statement-breakpoint
ALTER TABLE "vehicle_repairs" DROP CONSTRAINT "vehicle_services_agency_id_agencies_id_fk";
--> statement-breakpoint
ALTER TABLE "vehicle_repairs" DROP CONSTRAINT "vehicle_services_vehicle_id_vehicles_id_fk";
--> statement-breakpoint
ALTER TABLE "vehicle_repairs" DROP CONSTRAINT "vehicle_services_added_by_user_id_users_id_fk";
--> statement-breakpoint
DROP INDEX "vehicle_services_agency_vehicle_idx";--> statement-breakpoint
DROP INDEX "vehicle_services_agency_user_idx";--> statement-breakpoint
DROP INDEX "vehicle_services_agency_start_date_idx";--> statement-breakpoint
DROP INDEX "vehicle_services_agency_end_date_idx";--> statement-breakpoint
ALTER TABLE "agencies" ALTER COLUMN "business_address" SET DATA TYPE varchar(300);--> statement-breakpoint
ALTER TABLE "customers" ALTER COLUMN "address" SET DATA TYPE varchar(300);--> statement-breakpoint
ALTER TABLE "drivers" ALTER COLUMN "address" SET DATA TYPE varchar(300);--> statement-breakpoint
ALTER TABLE "vehicles" ALTER COLUMN "brand" SET DATA TYPE varchar(15);--> statement-breakpoint
ALTER TABLE "vehicles" ALTER COLUMN "color" SET DATA TYPE varchar(15);--> statement-breakpoint
ALTER TABLE "drivers" ADD COLUMN "license_photo_url" text;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "token" text NOT NULL;--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "puc_photo_url" text;--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "rc_photo_url" text;--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "vehicle_photo_url" text;--> statement-breakpoint
ALTER TABLE "vehicle_repairs" ADD CONSTRAINT "vehicle_repairs_agency_id_agencies_id_fk" FOREIGN KEY ("agency_id") REFERENCES "public"."agencies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicle_repairs" ADD CONSTRAINT "vehicle_repairs_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicle_repairs" ADD CONSTRAINT "vehicle_repairs_added_by_user_id_users_id_fk" FOREIGN KEY ("added_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "agencies_phone_email_idx" ON "agencies" USING btree ("business_phone","business_email");--> statement-breakpoint
CREATE UNIQUE INDEX "users_phone_email_role_idx" ON "users" USING btree ("phone","email","userRole");--> statement-breakpoint
CREATE INDEX "vehicle_repairs_agency_vehicle_idx" ON "vehicle_repairs" USING btree ("vehicle_id","agency_id");--> statement-breakpoint
CREATE INDEX "vehicle_repairs_agency_user_idx" ON "vehicle_repairs" USING btree ("added_by_user_id","agency_id");--> statement-breakpoint
CREATE INDEX "vehicle_repairs_agency_start_date_idx" ON "vehicle_repairs" USING btree ("start_date","agency_id");--> statement-breakpoint
CREATE INDEX "vehicle_repairs_agency_end_date_idx" ON "vehicle_repairs" USING btree ("end_date","agency_id");--> statement-breakpoint
ALTER TABLE "agencies" ADD CONSTRAINT "agencies_business_phone_business_email_unique" UNIQUE("business_phone","business_email");--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_token_unique" UNIQUE("token");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_phone_email_userRole_unique" UNIQUE("phone","email","userRole");--> statement-breakpoint
ALTER TABLE "vehicle_repairs" ADD CONSTRAINT "end_date >= start_date" CHECK ("vehicle_repairs"."end_date" >= "vehicle_repairs"."start_date");