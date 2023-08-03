/*
  Warnings:

  - Changed the type of `event` on the `Housing` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Housing" DROP COLUMN "event",
ADD COLUMN     "event" TEXT NOT NULL;

-- DropEnum
DROP TYPE "Event";
