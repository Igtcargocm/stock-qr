-- CreateTable
CREATE TABLE "public"."Gift" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "qr" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gift_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SalesRep" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SalesRep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Withdrawal" (
    "id" TEXT NOT NULL,
    "salesRepId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Withdrawal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WithdrawalItem" (
    "id" TEXT NOT NULL,
    "withdrawalId" TEXT NOT NULL,
    "giftId" TEXT NOT NULL,
    "qty" INTEGER NOT NULL,

    CONSTRAINT "WithdrawalItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Gift_sku_key" ON "public"."Gift"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "Gift_qr_key" ON "public"."Gift"("qr");

-- CreateIndex
CREATE UNIQUE INDEX "SalesRep_email_key" ON "public"."SalesRep"("email");

-- AddForeignKey
ALTER TABLE "public"."Withdrawal" ADD CONSTRAINT "Withdrawal_salesRepId_fkey" FOREIGN KEY ("salesRepId") REFERENCES "public"."SalesRep"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WithdrawalItem" ADD CONSTRAINT "WithdrawalItem_withdrawalId_fkey" FOREIGN KEY ("withdrawalId") REFERENCES "public"."Withdrawal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WithdrawalItem" ADD CONSTRAINT "WithdrawalItem_giftId_fkey" FOREIGN KEY ("giftId") REFERENCES "public"."Gift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
