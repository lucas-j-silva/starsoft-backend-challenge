CREATE TABLE "session_seat_reservations" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"session_seat_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"confirmed_at" timestamp with time zone,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "session_seat_reservations" ADD CONSTRAINT "session_seat_reservations_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_seat_reservations" ADD CONSTRAINT "session_seat_reservations_session_seat_id_session_seats_id_fk" FOREIGN KEY ("session_seat_id") REFERENCES "public"."session_seats"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "session_seat_reservations_session_seat_id_user_id_index" ON "session_seat_reservations" USING btree ("session_seat_id","user_id");