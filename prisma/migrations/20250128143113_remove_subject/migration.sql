/*
  Warnings:

  - You are about to drop the `Subject` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `progress` to the `Day` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_dayId_fkey";

-- AlterTable
ALTER TABLE "Day" ADD COLUMN     "progress" DECIMAL(65,30) NOT NULL;

-- DropTable
DROP TABLE "Subject";
