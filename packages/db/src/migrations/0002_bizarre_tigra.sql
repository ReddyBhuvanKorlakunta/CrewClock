-- USING clauses added by hand: a bare ALTER COLUMN ... SET DATA TYPE boolean
-- has no automatic cast from text, this would fail as generated.
ALTER TABLE "leave_categories" ALTER COLUMN "is_paid" SET DATA TYPE boolean USING is_paid::boolean;--> statement-breakpoint
ALTER TABLE "leave_categories" ALTER COLUMN "is_paid" SET DEFAULT true;--> statement-breakpoint
ALTER TABLE "leave_categories" ALTER COLUMN "is_paid" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "leave_categories" ALTER COLUMN "is_active" SET DATA TYPE boolean USING is_active::boolean;--> statement-breakpoint
ALTER TABLE "leave_categories" ALTER COLUMN "is_active" SET DEFAULT true;--> statement-breakpoint
ALTER TABLE "leave_categories" ALTER COLUMN "is_active" SET NOT NULL;