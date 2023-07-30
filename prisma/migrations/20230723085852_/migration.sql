/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
DROP COLUMN "name",
ADD COLUMN     "changed_password" TIMESTAMP(3),
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "id_user" SERIAL NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id_user");

-- CreateTable
CREATE TABLE "Profile" (
    "id_profile" INTEGER NOT NULL,
    "id_user" INTEGER NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "birthday" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "avatar" TEXT,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id_profile")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_id_user_key" ON "Profile"("id_user");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;
