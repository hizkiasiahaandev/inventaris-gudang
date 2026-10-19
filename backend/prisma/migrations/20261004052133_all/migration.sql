/*
  Warnings:

  - Added the required column `updatedAt` to the `stock_movements` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `stock_movements` ADD COLUMN `status` ENUM('COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'COMPLETED',
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;
