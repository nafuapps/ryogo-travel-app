CREATE TYPE "public"."entity_type" AS ENUM(
	'booking',
	'driver',
	'vehicle',
	'user',
	'agency',
	'customer'
);
--> statement-breakpoint
CREATE SEQUENCE "public"."mission_id_seq" INCREMENT BY 1 MINVALUE 1000000 MAXVALUE 9999999 START WITH 1000000 CACHE 1;
--> statement-breakpoint
CREATE SEQUENCE "public"."notification_id_seq" INCREMENT BY 1 MINVALUE 1000000 MAXVALUE 9999999 START WITH 1000000 CACHE 1;
--> statement-breakpoint
CREATE TABLE "missions" (
	"id" text PRIMARY KEY NOT NULL,
	"agency_id" text NOT NULL,
	"user_id" text NOT NULL,
	"entity_id" text NOT NULL,
	"entity_type" "entity_type" NOT NULL,
	"is_critical" boolean DEFAULT false NOT NULL,
	"title" text NOT NULL,
	"message" text,
	"due_date" timestamp with time zone,
	"is_read" boolean DEFAULT false NOT NULL,
	"link" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" text PRIMARY KEY NOT NULL,
	"agency_id" text NOT NULL,
	"entity_id" text NOT NULL,
	"entity_type" "entity_type" NOT NULL,
	"title" text NOT NULL,
	"is_feed" boolean DEFAULT true NOT NULL,
	"link" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TYPE "public"."payment_method"
RENAME VALUE 'netbanking' TO 'net banking';
--> statement-breakpoint
ALTER TABLE "missions"
ADD CONSTRAINT "missions_agency_id_agencies_id_fk" FOREIGN KEY ("agency_id") REFERENCES "public"."agencies"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "missions"
ADD CONSTRAINT "missions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "notifications"
ADD CONSTRAINT "notifications_agency_id_agencies_id_fk" FOREIGN KEY ("agency_id") REFERENCES "public"."agencies"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "missions_agency_idx" ON "missions" USING btree ("agency_id");
--> statement-breakpoint
CREATE INDEX "missions_user_idx" ON "missions" USING btree ("user_id");
--> statement-breakpoint
CREATE INDEX "missions_entity_id_idx" ON "missions" USING btree ("entity_id");
--> statement-breakpoint
CREATE INDEX "missions_entity_type_idx" ON "missions" USING btree ("entity_type");
--> statement-breakpoint
CREATE INDEX "notifications_agency_idx" ON "notifications" USING btree ("agency_id");
--> statement-breakpoint
CREATE INDEX "notifications_entity_id_idx" ON "notifications" USING btree ("entity_id");
--> statement-breakpoint
CREATE INDEX "notifications_entity_type_idx" ON "notifications" USING btree ("entity_type");