-- CreateTable
CREATE TABLE "about_us_testimonials" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "imageAlt" TEXT,
    "category" TEXT NOT NULL,
    "headline" TEXT NOT NULL,
    "ctaText" TEXT NOT NULL,
    "ctaHref" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "about_us_testimonials_pkey" PRIMARY KEY ("id")
);
