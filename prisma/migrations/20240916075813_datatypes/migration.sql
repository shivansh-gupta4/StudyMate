/*
  Warnings:

  - The primary key for the `Day` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Day` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `StudyPlan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `StudyPlan` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Subject` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Subject` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[studyPlanId]` on the table `Day` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[dayId]` on the table `Subject` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `studyPlanId` on the `Day` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `StudyPlan` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `dayId` on the `Subject` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Day" DROP CONSTRAINT "Day_studyPlanId_fkey";

-- DropForeignKey
ALTER TABLE "StudyPlan" DROP CONSTRAINT "StudyPlan_userId_fkey";

-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_dayId_fkey";

-- AlterTable
ALTER TABLE "Day" DROP CONSTRAINT "Day_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "studyPlanId",
ADD COLUMN     "studyPlanId" INTEGER NOT NULL,
ADD CONSTRAINT "Day_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "StudyPlan" DROP CONSTRAINT "StudyPlan_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "StudyPlan_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "dayId",
ADD COLUMN     "dayId" INTEGER NOT NULL,
ADD CONSTRAINT "Subject_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Day_studyPlanId_key" ON "Day"("studyPlanId");

-- CreateIndex
CREATE UNIQUE INDEX "StudyPlan_userId_key" ON "StudyPlan"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_dayId_key" ON "Subject"("dayId");

-- AddForeignKey
ALTER TABLE "StudyPlan" ADD CONSTRAINT "StudyPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Day" ADD CONSTRAINT "Day_studyPlanId_fkey" FOREIGN KEY ("studyPlanId") REFERENCES "StudyPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "Day"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
