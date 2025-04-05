-- CreateTable
CREATE TABLE "Topics" (
    "id" SERIAL NOT NULL,
    "dayId" INTEGER NOT NULL,
    "daynumber" INTEGER NOT NULL,
    "topicData" JSONB NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Topics_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Topics" ADD CONSTRAINT "Topics_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "Day"("id") ON DELETE CASCADE ON UPDATE CASCADE;
