/*
  Warnings:

  - Added the required column `supplierId` to the `items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `items` ADD COLUMN `supplierId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `items` ADD CONSTRAINT `items_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `Suppliers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
