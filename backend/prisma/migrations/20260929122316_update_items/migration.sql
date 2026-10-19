/*
  Warnings:

  - You are about to alter the column `purchasePrice` on the `items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(15,2)`.
  - A unique constraint covering the columns `[sku]` on the table `items` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sku` to the `items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `items` ADD COLUMN `minimumStock` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `sku` VARCHAR(191) NOT NULL,
    MODIFY `purchasePrice` DECIMAL(15, 2) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `items_sku_key` ON `items`(`sku`);
