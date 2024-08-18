/*
  Warnings:

  - Changed the type of `dt_leitura` on the `avaliacoes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "avaliacoes" DROP COLUMN "dt_leitura",
ADD COLUMN     "dt_leitura" TIMESTAMP(3) NOT NULL;
