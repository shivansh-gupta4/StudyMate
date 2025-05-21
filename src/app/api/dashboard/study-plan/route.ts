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

        const user = await prismaClient.user.findUnique({
            where: { email: session.user.email },
            include: {
                studyPlan: {
                    include: {
                        days: {
                            orderBy: {
                                dayNumber: 'desc'
                            },
                            take: 3,
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

        const studyPlan = user.studyPlan;
        const response = {
            id: studyPlan.id,
            planName: studyPlan.planName,
            totalDays: studyPlan.totalDays,
            CourseProgress: Number(studyPlan.CourseProgress),
            days: studyPlan.days.map(day => ({
                dayNumber: day.dayNumber,
                progress: Number(day.progress) / 100 // Convert to decimal for frontend
            }))
        };

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error("Error fetching study plan:", error);
        return NextResponse.json({ error: "Failed to fetch study plan" }, { status: 500 });
    }
} 