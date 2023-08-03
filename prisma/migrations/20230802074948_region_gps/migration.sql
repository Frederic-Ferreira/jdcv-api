/*
  Warnings:

  - Added the required column `gps` to the `Housing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `region` to the `Housing` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Region" AS ENUM ('auvergne_rhone_alpes', 'bourgogne_franche_comte', 'bretagne', 'centre_val_de_loire', 'corse', 'grand_est', 'hauts_de_france', 'ile_de_france', 'normandie', 'nouvelle_aquitaine', 'occitanie', 'pays_de_la_loire', 'provence_alpes_cote_d_azur', 'guadeloupe', 'martinique', 'guyane', 'la_reunion', 'mayotte');

-- AlterTable
ALTER TABLE "Housing" ADD COLUMN     "gps" TEXT NOT NULL,
ADD COLUMN     "region" "Region" NOT NULL;
