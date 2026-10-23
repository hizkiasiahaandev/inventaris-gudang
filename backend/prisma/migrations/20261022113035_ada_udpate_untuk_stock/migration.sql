-- AlterTable
ALTER TABLE `stock_movements` ADD COLUMN `cancelledAt` DATETIME(3) NULL,
    ADD COLUMN `cancelledById` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `stock_movements` ADD CONSTRAINT `stock_movements_cancelledById_fkey` FOREIGN KEY (`cancelledById`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
