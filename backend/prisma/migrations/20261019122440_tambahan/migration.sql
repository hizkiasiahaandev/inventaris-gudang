-- AlterTable
ALTER TABLE `items` ADD COLUMN `createdById` INTEGER NULL;

-- AlterTable
ALTER TABLE `stock_movements` ADD COLUMN `createdById` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `items` ADD CONSTRAINT `items_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_movements` ADD CONSTRAINT `stock_movements_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
