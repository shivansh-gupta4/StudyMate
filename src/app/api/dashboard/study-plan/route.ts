import { NextRequest, NextResponse } from 'next/server';
import prismaClient from "@/app/lib/db";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Fetch user with study plan and topics in a single optimized query
        const user = await prismaClient.user.findUnique({
            where: { email: session.user.email },
            include: {
                studyPlan: {
                    include: {
                        days: {
                            include: {
                                topics: {
                                    select: {
                                        completed: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!user?.studyPlan) {
            return NextResponse.json({ error: "Study plan not found" }, { status: 404 });
        }

        const studyPlan = user.studyPlan;
        const totalDays = studyPlan.totalDays;
        
        // Initialize days array with proper length
        const daysArray = new Array(totalDays).fill(null).map((_, index) => ({
            dayNumber: index + 1,
            progress: 0
        }));

        let completedDaysCount = 0;
        let totalCompletedTopics = 0;
        let totalTopics = 0;

        // Process each day and update the days array
        studyPlan.days.forEach(day => {
            const dayIndex = day.dayNumber - 1;
            if (dayIndex >= 0 && dayIndex < totalDays) {
                const dayTopics = day.topics;
                const completedTopics = dayTopics.filter(topic => topic.completed).length;
                const dayProgress = dayTopics.length > 0 ? (completedTopics / dayTopics.length) * 100 : 0;
                
                daysArray[dayIndex].progress = dayProgress;
                
                // Count completed days (100% progress)
                if (dayProgress === 100) {
                    completedDaysCount++;
                }

                totalCompletedTopics += completedTopics;
                totalTopics += dayTopics.length;
            }
        });

        const response = {
            id: studyPlan.id,
            planName: studyPlan.planName,
            totalDays: totalDays,
            completedDays: completedDaysCount,
            CourseProgress: totalTopics > 0 ? (totalCompletedTopics / totalTopics) * 100 : 0,
            days: daysArray
        };

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error("Error fetching study plan:", error);
        return NextResponse.json({ error: "Failed to fetch study plan" }, { status: 500 });
    }
} 