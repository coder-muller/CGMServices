-- CreateTable
CREATE TABLE "horarios" (
    "id" SERIAL NOT NULL,
    "chave" TEXT NOT NULL,
    "dia" TEXT NOT NULL,
    "id_setor" INTEGER NOT NULL,
    "h_inicio" TEXT NOT NULL,
    "h_termino" TEXT NOT NULL,
    "demanda" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "horarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "horarios_id_key" ON "horarios"("id");
