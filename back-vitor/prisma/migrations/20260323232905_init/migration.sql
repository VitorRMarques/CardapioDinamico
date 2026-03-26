-- CreateEnum
CREATE TYPE "Tipo" AS ENUM ('SALGADA', 'DOCE', 'ALCOOL', 'REFRI', 'AGUA', 'SUCO');

-- CreateTable
CREATE TABLE "restaurante" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(30) NOT NULL,

    CONSTRAINT "restaurante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produtos" (
    "id" SERIAL NOT NULL,
    "descricao" VARCHAR(30) NOT NULL,
    "preco" DECIMAL(10,2) NOT NULL,
    "foto" TEXT NOT NULL,
    "ingredientes" TEXT,
    "Tipo" "Tipo" NOT NULL DEFAULT 'SALGADA',
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "restauranteId" INTEGER NOT NULL,

    CONSTRAINT "produtos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "produtos" ADD CONSTRAINT "produtos_restauranteId_fkey" FOREIGN KEY ("restauranteId") REFERENCES "restaurante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
