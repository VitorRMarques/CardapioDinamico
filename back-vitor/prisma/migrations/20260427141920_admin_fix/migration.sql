/*
  Warnings:

  - You are about to drop the column `adminId` on the `pedidos` table. All the data in the column will be lost.
  - You are about to drop the column `adminId` on the `produtos` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "pedidos" DROP CONSTRAINT "pedidos_adminId_fkey";

-- DropForeignKey
ALTER TABLE "produtos" DROP CONSTRAINT "produtos_adminId_fkey";

-- AlterTable
ALTER TABLE "pedidos" DROP COLUMN "adminId";

-- AlterTable
ALTER TABLE "produtos" DROP COLUMN "adminId";
