import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import prismaClient from '@/app/lib/db';
import { Prisma } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    let { topicName, isCompleted } = body;

    if ( !topicName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
   const courseName = session.user.courseName;
    // Start a transaction to ensure all updates are atomic
    const result = await prismaClient.$transaction(async (prisma) => {
      // 1. Find the topic and its associated day
      const topic = await prisma.topics.findFirst({
        where: {
          topicData: {
            path: ['topic'],
            equals: topicName
          }
        },
        include: {
          day: true
        }
      });

      if (!topic) {
        throw new Error('Topic not found');
      }

      // 2. Update the topic completion status
      const updatedTopic = await prisma.topics.update({
        where: { id: topic.id },
        data: { completed: isCompleted }
      });

      // 3. Get all topics for this day to calculate progress
      const dayTopics = await prisma.topics.findMany({
        where: { dayId: topic.dayId }
      });

      // 4. Calculate day progress
      const completedTopics = dayTopics.filter(t => t.completed).length;
      const dayProgress = (completedTopics / dayTopics.length) * 100;

      // 5. Update day progress
      const updatedDay = await prisma.day.update({
        where: { id: topic.dayId },
        data: { progress: dayProgress }
      });

      // 6. Get all days in the study plan to calculate overall progress
      const studyPlanDays = await prisma.day.findMany({
        where: { studyPlanId: topic.day.studyPlanId }
      });

      // 7. Calculate overall course progress
      const totalProgress = studyPlanDays.reduce((acc, day) => acc + Number(day.progress), 0) / studyPlanDays.length;

      // 8. Update study plan progress
      const updatedStudyPlan = await prisma.studyPlan.update({
        where: { id: topic.day.studyPlanId },
        data: { CourseProgress: totalProgress }
      });

      return {
        topic: updatedTopic,
        day: updatedDay,
        studyPlan: updatedStudyPlan
      };
    });

    return NextResponse.json({ 
      success: true, 
      data: result 
    });

  } catch (error) {
    console.error('Error updating topic completion:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update completion status' },
      { status: 500 }
    );
  }
} 