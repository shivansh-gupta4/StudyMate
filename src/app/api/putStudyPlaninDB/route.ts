import { NextRequest, NextResponse } from 'next/server';
import prismaClient from "@/app/lib/db";
import { Prisma } from '@prisma/client';

// Type definitions
interface Subject {
    name: string;
    chapter: string;
    topics: string[];
}

interface DayPlan {
    day: number;
    subjects: Subject[];
}

interface StudyPlanData {
    study_plan: DayPlan[];
}

// Helper function to extract topics from any node in the study plan
function extractTopics(node: unknown, prefix: string = ''): string[] {
    const topics: string[] = [];
    
    // Handle primitive values
    if (typeof node === 'string') {
        return [prefix ? `${prefix}: ${node}` : node];
    }
    
    // Handle arrays - process each item
    if (Array.isArray(node)) {
        for (const item of node) {
            topics.push(...extractTopics(item, prefix));
        }
        return topics;
    }
    
    // Handle objects - process each key
    if (typeof node === 'object' && node !== null) {
        let currentPrefix = prefix;
        const nodeObj = node as Record<string, unknown>;
        const keys = Object.keys(nodeObj);
        
        for (const key of keys) {
            const value = nodeObj[key];
            
            // Skip arrays and objects for prefix building
            if (typeof value === 'string') {
                currentPrefix = currentPrefix 
                    ? `${currentPrefix}: ${value}` 
                    : value;
            }
        }
        
        // Process all values recursively
        for (const key of keys) {
            const value = nodeObj[key];
            
            // Skip primitive values that were already added to prefix
            if (typeof value !== 'string') {
                topics.push(...extractTopics(value, currentPrefix));
            }
        }
        
        // If no nested values, add the current prefix itself as a topic
        if (topics.length === 0 && currentPrefix) {
            topics.push(currentPrefix);
        }
        
        return topics;
    }
    
    // Fallback for other types
    return prefix ? [prefix] : [];
}

export async function POST(request: NextRequest) {
    try {
        const { user_id, studyPlanString } = await request.json();

        if (!user_id || !studyPlanString) {
            return NextResponse.json({ error: "Missing user_id or studyPlanString" }, { status: 400 });
        }

        // Validate user_id is a number
        const userIdNumber = parseInt(user_id);
        if (isNaN(userIdNumber)) {
            return NextResponse.json({ error: "Invalid user_id format" }, { status: 400 });
        }

        // Parse the studyPlanString into JSON format
        let studyPlanJSON: Prisma.InputJsonValue;
        try {
            studyPlanJSON = JSON.parse(studyPlanString) as Prisma.InputJsonValue;
        } catch (error) {
            return NextResponse.json({ error: "Invalid JSON format in studyPlanString" }, { status: 400 });
        }

        // Validate study plan structure
        if (!studyPlanJSON || typeof studyPlanJSON !== 'object' || 
            !('study_plan' in studyPlanJSON) || !Array.isArray((studyPlanJSON as unknown as StudyPlanData).study_plan)) {
            return NextResponse.json({ error: "Invalid study plan format" }, { status: 400 });
        }

        const studyPlan = (studyPlanJSON as unknown as StudyPlanData).study_plan;
        if (studyPlan.length === 0) {
            return NextResponse.json({ error: "Study plan cannot be empty" }, { status: 400 });
        }

        // Validate that each day has the required structure
        for (const day of studyPlan) {
            if (!day || typeof day !== 'object' || !('day' in day) || !('subjects' in day)) {
                return NextResponse.json({ error: "Invalid day structure in study plan" }, { status: 400 });
            }
        }

        // Save to database
        try {
            // First check if the study plan exists
            const existingStudyPlan = await prismaClient.studyPlan.findUnique({
                where: { userId: userIdNumber }
            });

            if (!existingStudyPlan) {
                return NextResponse.json({ 
                    error: "Study plan not found for this user. Please create a study plan first." 
                }, { status: 404 });
            }

            // Process each day in the study plan BEFORE transaction
            interface DayData {
                dayNumber: number;
                dayData: { subjects: Prisma.InputJsonValue[] };
                progress: Prisma.Decimal;
                topics: string[];
            }
            const daysData: DayData[] = [];

            for (const day of studyPlan) {
                if (!day || typeof day !== 'object' || !('day' in day)) continue;
                
                // Store the entire subjects array as-is
                const subjects = Array.isArray(day.subjects) ? day.subjects : [];
                const dayNumber = typeof day.day === 'number' ? day.day : parseInt(day.day) || 0;
                
                // Extract topics from the entire day object
                const topics = extractTopics(day);
                
                daysData.push({
                    dayNumber,
                    dayData: { subjects: subjects as unknown as Prisma.InputJsonValue[] },
                    progress: new Prisma.Decimal(0),
                    topics
                });
            }

            // Execute all database operations in a single transaction
            await prismaClient.$transaction(async (prisma) => {
                // Step 1: Update StudyPlan
                const updatedStudyPlan = await prisma.studyPlan.update({
                    where: { userId: userIdNumber },
                    data: { planData: studyPlanJSON },
                });

                // Step 2: Delete existing days (cascade deletes topics)
                await prisma.day.deleteMany({
                    where: {
                        studyPlanId: updatedStudyPlan.id
                    }
                });

                // Step 3: Create day records
                const createdDays = await Promise.all(
                    daysData.map(data => 
                        prisma.day.create({ 
                            data: {
                                dayNumber: data.dayNumber,
                                dayData: data.dayData,
                                progress: data.progress,
                                studyPlanId: updatedStudyPlan.id
                            }
                        })
                    )
                );

                // Step 4: Create topic records
                for (let i = 0; i < createdDays.length; i++) {
                    const day = createdDays[i];
                    const topics = daysData[i].topics;
                    
                    if (topics.length > 0) {
                        await prisma.topics.createMany({
                            data: topics.map((topic: string) => ({
                                dayId: day.id,
                                daynumber: day.dayNumber,
                                topicData: { topic },
                                completed: false
                            }))
                        });
                    }
                }
            });

        } catch (error) {
            console.error("Error updating StudyPlan:", error);
            
            // Provide more specific error messages
            if (error instanceof Error) {
                return NextResponse.json({ 
                    error: "Database update failed", 
                    details: error.message 
                }, { status: 500 });
            }
            
            return NextResponse.json({ error: "Database update failed" }, { status: 500 });
        }

        return NextResponse.json({ message: "Study plan saved successfully" });
    } catch (error) {
        console.error("Error saving study plan:", error);
        return NextResponse.json({ error: "Failed to save study plan" }, { status: 500 });
    }
}