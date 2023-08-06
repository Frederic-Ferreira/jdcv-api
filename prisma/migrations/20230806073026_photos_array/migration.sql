/*
  Warnings:

  - The `photos` column on the `Housing` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Housing" DROP COLUMN "photos",
ADD COLUMN     "photos" TEXT[];
