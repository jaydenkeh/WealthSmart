-- CreateTable
CREATE TABLE "AccountValue" (
    "id" SERIAL NOT NULL,
    "totalAssets" DOUBLE PRECISION NOT NULL,
    "totalSecuritiesValue" DOUBLE PRECISION NOT NULL,
    "cashBalance" DOUBLE PRECISION NOT NULL,
    "totalProfitLoss" DOUBLE PRECISION NOT NULL,
    "userEmail" TEXT NOT NULL,

    CONSTRAINT "AccountValue_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AccountValue" ADD CONSTRAINT "AccountValue_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
