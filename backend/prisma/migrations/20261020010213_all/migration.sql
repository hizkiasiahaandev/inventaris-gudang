/*
  Warnings:

  - Made the column `createdById` on table `items` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdById` on table `stock_movements` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `items` DROP FOREIGN KEY `items_createdById_fkey`;

-- DropForeignKey
ALTER TABLE `stock_movements` DROP FOREIGN KEY `stock_movements_createdById_fkey`;

-- DropIndex
DROP INDEX `items_createdById_fkey` ON `items`;

-- DropIndex
DROP INDEX `stock_movements_createdById_fkey` ON `stock_movements`;

-- AlterTable
ALTER TABLE `items` MODIFY `createdById` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `stock_movements` MODIFY `createdById` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `items` ADD CONSTRAINT `items_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_movements` ADD CONSTRAINT `stock_movements_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
