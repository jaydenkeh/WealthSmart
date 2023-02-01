/*
  Warnings:

  - You are about to drop the column `cashBalance` on the `AccountValue` table. All the data in the column will be lost.
  - You are about to drop the column `totalAssets` on the `AccountValue` table. All the data in the column will be lost.
  - You are about to drop the column `totalProfitLoss` on the `AccountValue` table. All the data in the column will be lost.
  - You are about to drop the column `totalSecuritiesValue` on the `AccountValue` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AccountValue" DROP COLUMN "cashBalance",
DROP COLUMN "totalAssets",
DROP COLUMN "totalProfitLoss",
DROP COLUMN "totalSecuritiesValue",
ADD COLUMN     "accumulatedProfitLoss" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "totalCashBalance" DOUBLE PRECISION NOT NULL DEFAULT 100000;
