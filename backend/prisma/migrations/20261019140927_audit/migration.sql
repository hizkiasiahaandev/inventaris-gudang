-- AlterTable
ALTER TABLE `items` ADD COLUMN `updatedById` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `items` ADD CONSTRAINT `items_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
