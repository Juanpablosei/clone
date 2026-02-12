-- AlterTable: añadir campos para la página completa de success story y slug único
ALTER TABLE "about_us_testimonials" ADD COLUMN "slug" TEXT;
ALTER TABLE "about_us_testimonials" ADD COLUMN "summary" TEXT NOT NULL DEFAULT '';
ALTER TABLE "about_us_testimonials" ADD COLUMN "industry" TEXT;
ALTER TABLE "about_us_testimonials" ADD COLUMN "heroImage" TEXT;
ALTER TABLE "about_us_testimonials" ADD COLUMN "heroImageAlt" TEXT;
ALTER TABLE "about_us_testimonials" ADD COLUMN "highlightedWord" TEXT;
ALTER TABLE "about_us_testimonials" ADD COLUMN "metric" TEXT;
ALTER TABLE "about_us_testimonials" ADD COLUMN "metricDescription" TEXT;
ALTER TABLE "about_us_testimonials" ADD COLUMN "sections" JSONB;

-- Rellenar slug para filas existentes (usar id como slug temporal)
UPDATE "about_us_testimonials" SET "slug" = "id" WHERE "slug" IS NULL;

-- Hacer slug obligatorio y único
ALTER TABLE "about_us_testimonials" ALTER COLUMN "slug" SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "about_us_testimonials_slug_key" ON "about_us_testimonials"("slug");

-- Eliminar ctaHref (ahora se deriva de slug: /success-stories/{slug})
ALTER TABLE "about_us_testimonials" DROP COLUMN IF EXISTS "ctaHref";
