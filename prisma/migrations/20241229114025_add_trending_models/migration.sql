-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Keyword" (
    "id" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "searchVolume" INTEGER NOT NULL,
    "trend" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Keyword_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductAnalysis" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "category" TEXT,
    "platform" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompetitorData" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "sales" INTEGER NOT NULL,
    "revenue" DOUBLE PRECISION NOT NULL,
    "rating" DOUBLE PRECISION,
    "platform" TEXT NOT NULL,
    "image" TEXT,
    "analysisId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompetitorData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalysisReport" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "keywordSuggestions" JSONB NOT NULL,
    "pricingInsights" JSONB NOT NULL,
    "contentSuggestions" JSONB NOT NULL,
    "seoRecommendations" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnalysisReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrendingKeyword" (
    "id" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "searchVolume" INTEGER NOT NULL,
    "trend" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrendingKeyword_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopProduct" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "sales" INTEGER NOT NULL,
    "revenue" DOUBLE PRECISION NOT NULL,
    "image" TEXT,
    "url" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TopProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_KeywordToProductAnalysis" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_KeywordToProductAnalysis_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AnalysisReport_analysisId_key" ON "AnalysisReport"("analysisId");

-- CreateIndex
CREATE UNIQUE INDEX "TrendingKeyword_platform_rank_key" ON "TrendingKeyword"("platform", "rank");

-- CreateIndex
CREATE UNIQUE INDEX "TopProduct_platform_rank_key" ON "TopProduct"("platform", "rank");

-- CreateIndex
CREATE INDEX "_KeywordToProductAnalysis_B_index" ON "_KeywordToProductAnalysis"("B");

-- AddForeignKey
ALTER TABLE "ProductAnalysis" ADD CONSTRAINT "ProductAnalysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitorData" ADD CONSTRAINT "CompetitorData_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "ProductAnalysis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalysisReport" ADD CONSTRAINT "AnalysisReport_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "ProductAnalysis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_KeywordToProductAnalysis" ADD CONSTRAINT "_KeywordToProductAnalysis_A_fkey" FOREIGN KEY ("A") REFERENCES "Keyword"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_KeywordToProductAnalysis" ADD CONSTRAINT "_KeywordToProductAnalysis_B_fkey" FOREIGN KEY ("B") REFERENCES "ProductAnalysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;
