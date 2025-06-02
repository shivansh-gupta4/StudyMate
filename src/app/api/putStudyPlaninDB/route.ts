import { NextRequest, NextResponse } from 'next/server';
import prismaClient from "@/app/lib/db";
import { Prisma } from '@prisma/client';

// Helper function to extract topics from any node in the study plan
function extractTopics(node: any, prefix: string = ''): string[] {
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
        const keys = Object.keys(node);
        
        for (const key of keys) {
            const value = node[key];
            
            // Skip arrays and objects for prefix building
            if (typeof value === 'string') {
                currentPrefix = currentPrefix 
                    ? `${currentPrefix}: ${value}` 
                    : value;
            }
        }
        
        // Process all values recursively
        for (const key of keys) {
            const value = node[key];
            
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

        // Parse the studyPlanString into JSON format
        let studyPlanJSON: Prisma.InputJsonValue;
        try {
            studyPlanJSON = JSON.parse(studyPlanString) as Prisma.InputJsonValue;
        } catch (error) {
            return NextResponse.json({ error: "Invalid JSON format in studyPlanString" }, { status: 400 });
        }

        // Validate study plan structure
        if (!studyPlanJSON || typeof studyPlanJSON !== 'object' || 
            !('study_plan' in studyPlanJSON) || !Array.isArray((studyPlanJSON as any).study_plan)) {
            return NextResponse.json({ error: "Invalid study plan format" }, { status: 400 });
        }

        // Save to database
        try {
            const updatedStudyPlan = await prismaClient.studyPlan.update({
                where: { userId: user_id },
                data: { planData: studyPlanJSON },
            });

            // Process each day in the study plan
            interface DayData {
                dayNumber: number;
                dayData: { subjects: any[] };
                progress: Prisma.Decimal;
                studyPlanId: number;
                topics: string[];
            }
            const daysData: DayData[] = [];
            const studyPlan = (studyPlanJSON as any).study_plan;

            for (const day of studyPlan) {
                if (!day || typeof day !== 'object' || !('day' in day)) continue;
                
                // Store the entire subjects array as-is
                const subjects = Array.isArray(day.subjects) ? day.subjects : [];
                const dayNumber = typeof day.day === 'number' ? day.day : parseInt(day.day) || 0;
                
                // Extract topics from the entire day object
                const topics = extractTopics(day);
                
                daysData.push({
                    dayNumber,
                    dayData: { subjects },
                    progress: new Prisma.Decimal(0),
                    studyPlanId: updatedStudyPlan.id,
                    topics
                });
            }

            // Create all Day records and their associated Topics
            await prismaClient.$transaction(async (prisma) => {
                // Create day records
                const createdDays = await Promise.all(
                    daysData.map(data => 
                        prisma.day.create({ 
                            data: {
                                dayNumber: data.dayNumber,
                                dayData: data.dayData,
                                progress: data.progress,
                                studyPlanId: data.studyPlanId
                            }
                        })
                    )
                );

                // Create topic records
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
            return NextResponse.json({ error: "Database update failed" }, { status: 500 });
        }

        return NextResponse.json({ message: "Study plan saved successfully" });
    } catch (error) {
        console.error("Error saving study plan:", error);
        return NextResponse.json({ error: "Failed to save study plan" }, { status: 500 });
    }
}