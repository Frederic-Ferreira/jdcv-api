-- DropForeignKey
ALTER TABLE "Housing" DROP CONSTRAINT "Housing_id_user_fkey";

-- DropForeignKey
ALTER TABLE "Housing_Disponibility" DROP CONSTRAINT "Housing_Disponibility_id_housing_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_id_reservation_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_id_user_fkey";

-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_id_housing_fkey";

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Housing" ADD CONSTRAINT "Housing_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Housing_Disponibility" ADD CONSTRAINT "Housing_Disponibility_id_housing_fkey" FOREIGN KEY ("id_housing") REFERENCES "Housing"("id_housing") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_id_housing_fkey" FOREIGN KEY ("id_housing") REFERENCES "Housing"("id_housing") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_id_reservation_fkey" FOREIGN KEY ("id_reservation") REFERENCES "Reservation"("id_reservation") ON DELETE CASCADE ON UPDATE CASCADE;
