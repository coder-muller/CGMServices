-- CreateTable
CREATE TABLE "setores" (
    "id" SERIAL NOT NULL,
    "chave" TEXT NOT NULL,
    "setor" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "setores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profissionais" (
    "id" SERIAL NOT NULL,
    "chave" TEXT NOT NULL,
    "profissional" TEXT NOT NULL,
    "id_setor" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profissionais_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "setores_id_key" ON "setores"("id");

-- CreateIndex
CREATE UNIQUE INDEX "profissionais_id_key" ON "profissionais"("id");
