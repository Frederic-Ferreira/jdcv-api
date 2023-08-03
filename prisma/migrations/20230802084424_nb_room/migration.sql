/*
  Warnings:

  - You are about to drop the column `equipments` on the `Housing` table. All the data in the column will be lost.
  - You are about to drop the column `event` on the `Housing` table. All the data in the column will be lost.
  - Added the required column `events` to the `Housing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nb_room` to the `Housing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Housing" DROP COLUMN "equipments",
DROP COLUMN "event",
ADD COLUMN     "events" TEXT NOT NULL,
ADD COLUMN     "nb_room" INTEGER NOT NULL;
