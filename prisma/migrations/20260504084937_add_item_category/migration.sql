-- CreateEnum
CREATE TYPE "ItemCategory" AS ENUM ('LAPTOP', 'PHONE', 'TABLET', 'MOUSE', 'KEYBOARD', 'OTHER');

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "category" "ItemCategory" NOT NULL DEFAULT 'OTHER';

-- CreateIndex
CREATE INDEX "Item_category_idx" ON "Item"("category");
