CREATE TYPE "public"."ticket_status" AS ENUM('open', 'in progress', 'resolved', 'closed');
--> statement-breakpoint
CREATE SEQUENCE "public"."support_query_id_seq" INCREMENT BY 1 MINVALUE 1000000 MAXVALUE 9999999 START WITH 1000000 CACHE 1;
--> statement-breakpoint
CREATE SEQUENCE "public"."support_ticket_id_seq" INCREMENT BY 1 MINVALUE 1000000 MAXVALUE 9999999 START WITH 1000000 CACHE 1;
--> statement-breakpoint
CREATE TABLE "support_queries" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(30) NOT NULL,
	"phone" varchar(60) NOT NULL,
	"message" varchar(300) NOT NULL,
	"business_name" varchar(30),
	"is_solved" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "support_tickets" (
	"id" text PRIMARY KEY NOT NULL,
	"agency_id" text NOT NULL,
	"user_id" text NOT NULL,
	"entity_id" text,
	"entity_type" "entity_type" NOT NULL,
	"issue" varchar(60) NOT NULL,
	"details" varchar(300),
	"photo_url" text,
	"comment_by_support" varchar(300),
	"resolution_rating" integer,
	"status" "ticket_status" DEFAULT 'open' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "resolution rating >=1 and rating <=5" CHECK (
		"support_tickets"."resolution_rating" >= 1
		AND "support_tickets"."resolution_rating" <= 5
	)
);
--> statement-breakpoint
ALTER TABLE "agencies"
ADD COLUMN "has_tried_subscription" boolean DEFAULT false NOT NULL;
--> statement-breakpoint
ALTER TABLE "agencies"
ADD COLUMN "qr_code_url" text;
--> statement-breakpoint
ALTER TABLE "missions"
ADD COLUMN "is_custom" boolean DEFAULT false NOT NULL;
--> statement-breakpoint
ALTER TABLE "support_tickets"
ADD CONSTRAINT "support_tickets_agency_id_agencies_id_fk" FOREIGN KEY ("agency_id") REFERENCES "public"."agencies"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "support_tickets"
ADD CONSTRAINT "support_tickets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "support_tickets_agency_idx" ON "support_tickets" USING btree ("agency_id");
--> statement-breakpoint
CREATE INDEX "support_tickets_user_idx" ON "support_tickets" USING btree ("user_id");