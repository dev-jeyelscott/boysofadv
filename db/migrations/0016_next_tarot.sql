CREATE TABLE "build_comments" (
	"id" text PRIMARY KEY NOT NULL,
	"build_id" text NOT NULL,
	"user_id" text NOT NULL,
	"parent_id" text,
	"body" text NOT NULL,
	"deleted_at" timestamp,
	"deleted_by_user_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "build_comments_not_self_parent" CHECK ("build_comments"."parent_id" is null or "build_comments"."parent_id" <> "build_comments"."id"),
	CONSTRAINT "build_comments_body_not_blank" CHECK (length(trim("build_comments"."body")) > 0)
);
--> statement-breakpoint
CREATE TABLE "build_comment_likes" (
	"id" text PRIMARY KEY NOT NULL,
	"comment_id" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "build_comments" ADD CONSTRAINT "build_comments_build_id_builds_id_fk" FOREIGN KEY ("build_id") REFERENCES "public"."builds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "build_comments" ADD CONSTRAINT "build_comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "build_comments" ADD CONSTRAINT "build_comments_parent_id_build_comments_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."build_comments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "build_comments" ADD CONSTRAINT "build_comments_deleted_by_user_id_users_id_fk" FOREIGN KEY ("deleted_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "build_comment_likes" ADD CONSTRAINT "build_comment_likes_comment_id_build_comments_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."build_comments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "build_comment_likes" ADD CONSTRAINT "build_comment_likes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "build_comments_build_parent_created_idx" ON "build_comments" USING btree ("build_id","parent_id","created_at");--> statement-breakpoint
CREATE INDEX "build_comments_parent_created_idx" ON "build_comments" USING btree ("parent_id","created_at");--> statement-breakpoint
CREATE INDEX "build_comments_user_created_idx" ON "build_comments" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "build_comments_active_build_created_idx" ON "build_comments" USING btree ("build_id","created_at") WHERE "build_comments"."deleted_at" is null;--> statement-breakpoint
CREATE UNIQUE INDEX "build_comment_likes_user_comment_unique" ON "build_comment_likes" USING btree ("user_id","comment_id");--> statement-breakpoint
CREATE INDEX "build_comment_likes_comment_created_idx" ON "build_comment_likes" USING btree ("comment_id","created_at");