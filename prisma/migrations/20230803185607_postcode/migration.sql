/*
  Warnings:

  - Added the required column `post_code` to the `Housing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Housing" ADD COLUMN     "post_code" INTEGER NOT NULL;
