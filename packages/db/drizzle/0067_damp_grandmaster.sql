CREATE UNIQUE INDEX "agencies_phone_email_idx" ON "agencies" USING btree ("business_phone", "business_email");
--> statement-breakpoint
CREATE UNIQUE INDEX "customers_agency_phone_idx" ON "customers" USING btree ("agency_id", "phone");
--> statement-breakpoint
CREATE UNIQUE INDEX "drivers_agency_phone_number_idx" ON "drivers" USING btree ("phone", "agency_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "drivers_user_id_idx" ON "drivers" USING btree ("user_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "locations_city_state_idx" ON "locations" USING btree ("city", "state");
--> statement-breakpoint
CREATE INDEX "notifications_user_idx" ON "notifications" USING btree ("user_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "orders_rp_order_id_idx" ON "orders" USING btree ("rp_order_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "payments_rp_payment_id_idx" ON "payments" USING btree ("rp_payment_id");
--> statement-breakpoint
CREATE INDEX "product_feedbacks_entity_idx" ON "product_feedbacks" USING btree ("entity_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "routes_source_destination_idx" ON "routes" USING btree ("source_id", "destination_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "sessions_token_idx" ON "sessions" USING btree ("token");
--> statement-breakpoint
CREATE INDEX "support_queries_solved_idx" ON "support_queries" USING btree ("is_solved");
--> statement-breakpoint
CREATE INDEX "support_queries_phone_idx" ON "support_queries" USING btree ("phone");
--> statement-breakpoint
CREATE INDEX "support_tickets_entity_id_idx" ON "support_tickets" USING btree ("entity_id");
--> statement-breakpoint
CREATE INDEX "support_tickets_entity_type_idx" ON "support_tickets" USING btree ("entity_type");
--> statement-breakpoint
CREATE INDEX "support_tickets_status_idx" ON "support_tickets" USING btree ("status");
--> statement-breakpoint
CREATE INDEX "support_tickets_user_status_idx" ON "support_tickets" USING btree ("user_id", "status");
--> statement-breakpoint
CREATE UNIQUE INDEX "vehicles_agency_vehicle_number_idx" ON "vehicles" USING btree ("vehicle_number", "agency_id");