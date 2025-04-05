-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Registered', 'New');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'New';
