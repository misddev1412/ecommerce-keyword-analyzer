-- DropForeignKey
ALTER TABLE "ProductAnalysis" DROP CONSTRAINT "ProductAnalysis_userId_fkey";

-- AlterTable
ALTER TABLE "ProductAnalysis" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ProductAnalysis" ADD CONSTRAINT "ProductAnalysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
