-- AlterTable
ALTER TABLE `inventoryhistory` MODIFY `type` ENUM('IN', 'OUT', 'ADJUSTMENT', 'SYSTEM') NOT NULL;
