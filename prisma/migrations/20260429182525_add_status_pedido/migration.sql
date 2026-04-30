-- CreateEnum
CREATE TYPE "StatusPedido" AS ENUM ('PENDENTE', 'PRONTO', 'ENTREGUE');

-- AlterTable
ALTER TABLE "pedidos" ADD COLUMN     "status" "StatusPedido" NOT NULL DEFAULT 'PENDENTE';
