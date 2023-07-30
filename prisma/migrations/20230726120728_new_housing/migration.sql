/*
  Warnings:

  - You are about to drop the `Equipment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Equipment_Housing` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `equipments` to the `Housing` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Equipment_Housing" DROP CONSTRAINT "Equipment_Housing_id_equipment_fkey";

-- DropForeignKey
ALTER TABLE "Equipment_Housing" DROP CONSTRAINT "Equipment_Housing_id_housing_fkey";

-- AlterTable
ALTER TABLE "Housing" ADD COLUMN     "equipments" TEXT NOT NULL;

-- DropTable
DROP TABLE "Equipment";

-- DropTable
DROP TABLE "Equipment_Housing";

-- DropEnum
DROP TYPE "Equipments";
