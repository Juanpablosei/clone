-- CreateTable
CREATE TABLE "advisory_page" (
    "id" TEXT NOT NULL,
    "introBadge" TEXT,
    "introTitle" TEXT,
    "introDescription" TEXT,
    "accordionItems" JSONB,
    "features" JSONB,
    "contentImage" TEXT,
    "contentImageAlt" TEXT,
    "contentBadge" TEXT,
    "contentTitle" TEXT,
    "contentDescription" TEXT,
    "iconType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "advisory_page_pkey" PRIMARY KEY ("id")
);
