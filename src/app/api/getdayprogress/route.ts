import prismaClient from "@/app/lib/db";
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();
        
        // Get user and their study plan with all days' progress in a single query
        const user = await prismaClient.user.findUnique({
            where: { email },
            select: {
                studyPlan: {
                    select: {
                        days: {
                            select: {
                                dayNumber: true,
                                progress: true
                            }
                        }
                    }
                }
            }
        });

        if (!user?.studyPlan) {
            return NextResponse.json({ error: "Study plan not found" }, { status: 404 });
        }

        // Create a map of day numbers to their completion status
        const completedDays = user.studyPlan.days.reduce((acc, day) => {
            acc[day.dayNumber] = Number(day.progress) === 100;
            return acc;
        }, {} as Record<number, boolean>);

        return NextResponse.json({ completedDays }, { status: 200 });

    } catch (error) {
        console.error("Error fetching day progress:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
} 