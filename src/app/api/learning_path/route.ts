import prismaClient from "@/app/lib/db";
import { NextRequest, NextResponse } from 'next/server';
import { generateResponse } from "@/app/services/groqApi";


export async function POST(request: NextRequest) {
  try {
    const { user_id, learning_path, learning_days } = await request.json();  // Destructure data from the frontend

    // Check if the user exists
    const user = await prismaClient.user.findUnique({ where: { id: user_id } });
    
    if (!user) {
      return NextResponse.json({ ok: false, message: 'User does not exist' }, { status: 400 });
    }
 
      const studyPlan = await prismaClient.studyPlan.create({
        data: {
          userId: user_id,           // Associate the study plan with the user
          planName: learning_path,   // Set the course name
          totalDays: learning_days,  // Set the total days
          planData: {},   // Optionally initialize with empty plan data
        },
      });
     
      const exsting_user = await prismaClient.user.update({
        where: {
          id: user_id,
        },
        data: {
          CourseFilled: true,  // Update the total days
        },
      });
      return NextResponse.json({ ok: true, studyPlan });  // Return the study plan details
    } 

    
 catch (error) {
    return NextResponse.json({ ok: false, message: 'An error occurred' }, { status: 500 });
  }
}
