import { NextRequest, NextResponse } from 'next/server';
import prismaClient from "@/app/lib/db";
import { Prisma } from '@prisma/client';

export async function POST(request: NextRequest) {
    try {
        const { user_id, studyPlanString } = await request.json();

        if (!user_id || !studyPlanString) {
            return NextResponse.json({ error: "Missing user_id or studyPlanString" }, { status: 400 });
        }

        // Parse the studyPlanString into JSON format
        let studyPlanJSON: Prisma.InputJsonValue;
        try {
            studyPlanJSON = JSON.parse(studyPlanString) as Prisma.InputJsonValue;
        } catch (error) {
            return NextResponse.json({ error: "Invalid JSON format in studyPlanString" }, { status: 400 });
        }

        // Save to database
        try {
            const updatedStudyPlan = await prismaClient.studyPlan.update({
              where: {
                userId: user_id,  // Identify the study plan by userId
              },
              data: {
                 planData: studyPlanJSON,    // Update the course name
              },
            });
        
            console.log("Updated StudyPlan:", updatedStudyPlan);
          
          
            // Extract days data from the studyPlanJSON and map to Day table format
            const daysData = (studyPlanJSON as any).study_plan.map((day: any) => ({
                dayNumber: day.day,
                dayData: {
                    subjects: day.subjects.map((subject: any) => ({
                        name: subject.name || null,
                        chapter: subject.chapter || null,
                        sub_topics: subject.sub_topics || []
                    }))
                },
                progress: new Prisma.Decimal(0),
                studyPlanId: updatedStudyPlan.id
            }));

            // Create all Day records and their associated Topics in a transaction
            await prismaClient.$transaction(async (prisma) => {
                // First create all days
                const createdDays = await Promise.all(
                    daysData.map((dayData: { dayNumber: number; dayData: any; progress: Prisma.Decimal; studyPlanId: number }) => 
                        prisma.day.create({ data: dayData })
                    )
                );

                // For each day, extract topics and create Topics records
                for (const day of createdDays) {
                    const dayData = day.dayData as any;
                    const topics: string[] = [];

                    // Using the same logic as in dateplanner.tsx
                    if (dayData.subjects) {
                        dayData.subjects.forEach((subject: any) => {
                            let baseString = '';
                            
                            if (subject.name && subject.chapter) {
                                baseString = `${subject.name}: ${subject.chapter}`;
                            } else if (subject.name) {
                                baseString = subject.name;
                            } else if (subject.chapter) {
                                baseString = subject.chapter;
                            }

                            if (subject.sub_topics.length === 0) {
                                if (baseString) {
                                    topics.push(baseString);
                                }
                            } else {
                                subject.sub_topics.forEach((subtopic: any) => {
                                    if (baseString) {
                                        topics.push(`${baseString}: ${subtopic}`);
                                    } else {
                                        topics.push(`${subtopic}`);
                                    }
                                });
                            }
                        });
                    }

                    // Create Topics records for this day
                    await prisma.topics.createMany({
                        data: topics.map((topic, index) => ({
                            dayId: day.id,
                            daynumber: day.dayNumber,
                            topicData: { topic },
                            completed: false
                        }))
                    });
                }
            });
      
      }
          catch (error) {
            console.error("Error updating StudyPlan:", error);
          }

        return NextResponse.json({ message: "Study plan saved successfully" });
    } catch (error) {
        console.error("Error saving study plan:", error);
        return NextResponse.json({ error: "Failed to save study plan" }, { status: 500 });
    }
}