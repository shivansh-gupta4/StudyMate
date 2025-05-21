import prismaClient from "@/app/lib/db";
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { email, daynumber } = await request.json();
        const user = await prismaClient.user.findUnique({
            where: { email },
        });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        const studyPlan = await prismaClient.studyPlan.findUnique({
            where: { userId: user.id },
            select: {
                id: true,
                CourseProgress: true,
                createdAt: true,
                totalDays: true,
                planName: true,
                days: {
                    where: { dayNumber: daynumber },
                    select: {
                        topics: {
                            select: {
                                topicData: true,
                                completed: true
                            }
                        }
                    }
                }
            }
        });
        
        if (!studyPlan || !studyPlan.days[0]) {
            return NextResponse.json({ error: "Study plan not found" }, { status: 404 });
        }

        const day = studyPlan.days[0];
        const topicsData = day.topics.map(topic => [
            (topic.topicData as any).topic,
            topic.completed
        ]);

        return NextResponse.json({ 
            message: [topicsData, studyPlan.CourseProgress, studyPlan.createdAt, studyPlan.totalDays, studyPlan.planName] 
        }, { status: 200 });

    } catch (error) {
        console.error("Network or server error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
