CREATE TYPE "public"."field_type" AS ENUM('text', 'number', 'file', 'image', 'url', 'phone', 'date', 'time', 'email', 'checkbox', 'select', 'radio', 'textarea', 'group');--> statement-breakpoint
CREATE TABLE "booking_form_fields" (
	"id" uuid PRIMARY KEY NOT NULL,
	"booking_form_id" uuid,
	"name" text NOT NULL,
	"type" "field_type" NOT NULL,
	"key" text NOT NULL,
	"required" boolean DEFAULT false NOT NULL,
	"parent_id" uuid,
	"order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "booking_forms" (
	"id" uuid PRIMARY KEY NOT NULL,
	"organization_id" uuid,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY NOT NULL,
	"booking_form_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"data" jsonb NOT NULL
);
--> statement-breakpoint
ALTER TABLE "customers" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "stripe_connections" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "subscriptions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "stripe_events" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "customers" CASCADE;--> statement-breakpoint
DROP TABLE "stripe_connections" CASCADE;--> statement-breakpoint
DROP TABLE "subscriptions" CASCADE;--> statement-breakpoint
DROP TABLE "stripe_events" CASCADE;--> statement-breakpoint
ALTER TABLE "organizations" DROP CONSTRAINT "organizations_slug_unique";--> statement-breakpoint
ALTER TABLE "members" DROP CONSTRAINT "members_organization_id_organizations_id_fk";
--> statement-breakpoint
ALTER TABLE "members" DROP CONSTRAINT "members_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "password" text NOT NULL;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "secret_key" uuid DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "booking_form_fields" ADD CONSTRAINT "booking_form_fields_booking_form_id_booking_forms_id_fk" FOREIGN KEY ("booking_form_id") REFERENCES "public"."booking_forms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking_form_fields" ADD CONSTRAINT "booking_form_fields_parent_id_booking_form_fields_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."booking_form_fields"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking_forms" ADD CONSTRAINT "booking_forms_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_booking_form_id_booking_forms_id_fk" FOREIGN KEY ("booking_form_id") REFERENCES "public"."booking_forms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;