-- CreateEnum
CREATE TYPE "Style" AS ENUM ('maison', 'villa', 'chalet', 'domaine', 'insolite', 'exterieur');

-- CreateEnum
CREATE TYPE "Event" AS ENUM ('apero', 'barbecue', 'anniversaire', 'mariage', 'fete', 'date');

-- CreateEnum
CREATE TYPE "Note" AS ENUM ('ONE', 'TWO', 'THREE', 'FOUR', 'FIVE');

-- CreateEnum
CREATE TYPE "Equipments" AS ENUM ('piscine', 'terrasse', 'jardin', 'sono', 'jaccuzzi', 'gym', 'parking');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('pending', 'canceled', 'approved');

-- CreateEnum
CREATE TYPE "Method" AS ENUM ('card', 'paypal');

-- CreateTable
CREATE TABLE "Housing" (
    "id_housing" SERIAL NOT NULL,
    "id_user" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "nb_people" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "price" INTEGER NOT NULL,
    "style" "Style" NOT NULL,
    "event" "Event" NOT NULL,
    "photos" TEXT NOT NULL,

    CONSTRAINT "Housing_pkey" PRIMARY KEY ("id_housing")
);

-- CreateTable
CREATE TABLE "Equipment" (
    "id_equipment" SERIAL NOT NULL,
    "name" "Equipments" NOT NULL,

    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id_equipment")
);

-- CreateTable
CREATE TABLE "Equipment_Housing" (
    "id_housing" INTEGER NOT NULL,
    "id_equipment" INTEGER NOT NULL,

    CONSTRAINT "Equipment_Housing_pkey" PRIMARY KEY ("id_housing","id_equipment")
);

-- CreateTable
CREATE TABLE "Housing_Disponibility" (
    "id_housing_disponibility" SERIAL NOT NULL,
    "id_housing" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Housing_Disponibility_pkey" PRIMARY KEY ("id_housing_disponibility")
);

-- CreateTable
CREATE TABLE "Note_Comment" (
    "id_note_comment" SERIAL NOT NULL,
    "id_housing" INTEGER,
    "id_receiver" INTEGER,
    "id_user" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "note" "Note" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Note_Comment_pkey" PRIMARY KEY ("id_note_comment")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id_reservation" SERIAL NOT NULL,
    "id_user" INTEGER NOT NULL,
    "id_housing" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "status" "Status" NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id_reservation")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id_payment" SERIAL NOT NULL,
    "id_reservation" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "method" "Method" NOT NULL,
    "status" "Status" NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id_payment")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_id_reservation_key" ON "Payment"("id_reservation");

-- AddForeignKey
ALTER TABLE "Housing" ADD CONSTRAINT "Housing_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equipment_Housing" ADD CONSTRAINT "Equipment_Housing_id_housing_fkey" FOREIGN KEY ("id_housing") REFERENCES "Housing"("id_housing") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equipment_Housing" ADD CONSTRAINT "Equipment_Housing_id_equipment_fkey" FOREIGN KEY ("id_equipment") REFERENCES "Equipment"("id_equipment") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Housing_Disponibility" ADD CONSTRAINT "Housing_Disponibility_id_housing_fkey" FOREIGN KEY ("id_housing") REFERENCES "Housing"("id_housing") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note_Comment" ADD CONSTRAINT "Note_Comment_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_id_housing_fkey" FOREIGN KEY ("id_housing") REFERENCES "Housing"("id_housing") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_id_reservation_fkey" FOREIGN KEY ("id_reservation") REFERENCES "Reservation"("id_reservation") ON DELETE RESTRICT ON UPDATE CASCADE;
