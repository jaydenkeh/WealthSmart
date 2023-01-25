/*
  Warnings:

  - You are about to drop the column `percentChange` on the `Watchlist` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Watchlist` table. All the data in the column will be lost.
  - You are about to drop the column `priceChange` on the `Watchlist` table. All the data in the column will be lost.
  - You are about to drop the column `volume` on the `Watchlist` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Watchlist" DROP COLUMN "percentChange",
DROP COLUMN "price",
DROP COLUMN "priceChange",
DROP COLUMN "volume";
