CREATE TYPE "public"."booking_status" AS ENUM('pending', 'confirmed', 'cancelled_by_user', 'cancelled_by_admin');--> statement-breakpoint
CREATE TABLE "booking_form_meta_data" (
	"id" uuid PRIMARY KEY NOT NULL,
	"booking_form_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"og_image" text,
	"theme_color" text,
	"additional_meta_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "booking_form_styles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"booking_form_id" uuid NOT NULL,
	"primary_color" text,
	"bg_main" text,
	"bg_secondary" text,
	"border_color" text,
	"text_main" text,
	"text_secondary" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "booking_form_fields" ALTER COLUMN "booking_form_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "booking_forms" ALTER COLUMN "organization_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "booking_forms" ADD COLUMN "slug" text NOT NULL;--> statement-breakpoint
ALTER TABLE "booking_forms" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "booking_forms" ADD COLUMN "total_bookings" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "status" "booking_status" DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "booking_form_meta_data" ADD CONSTRAINT "booking_form_meta_data_booking_form_id_booking_forms_id_fk" FOREIGN KEY ("booking_form_id") REFERENCES "public"."booking_forms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking_form_styles" ADD CONSTRAINT "booking_form_styles_booking_form_id_booking_forms_id_fk" FOREIGN KEY ("booking_form_id") REFERENCES "public"."booking_forms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking_form_fields" ADD CONSTRAINT "booking_form_fields_id_unique" UNIQUE("id");