
import { signIn } from "next-auth/react";
import prismaClient from "@/app/lib/db";
import { PrismaClient, Prisma } from "@prisma/client";

//taking input of initial course and number of days
export async function updateStudyPlan(userId: number, newPlanName: string, newTotalDays: number) {

  console.log("updating study plan tnppppp",userId);
  try {
    const updatedStudyPlan = await prismaClient.studyPlan.update({
      where: {
        userId: userId,  // Identify the study plan by userId
      },
      data: {
        planName: newPlanName,    // Update the course name
        totalDays: newTotalDays,  // Update the number of days
      },
    });
    const updatedUser = await prismaClient.user.update({
      where: {
        id: userId,  // Identify the study plan by userId
      },
      data: {
        CourseFilled: true,    // Update the course boolean check
      },
    });

    console.log("Updated StudyPlan:", updatedStudyPlan);
    return updatedStudyPlan;
  } catch (error) {
    console.error("Error updating StudyPlan:", error);
  }
}

// Social Login (Google/GitHub)
export async function doSocialLogin(action: "GOOGLE" | "GITHUB", formType: "login" | "register") {
  console.log(formType);
  console.log(action);

  const callbackUrl = `/dashboard/calendar`;
  console.log(callbackUrl);

  // Perform the sign-in and pass the formType in the callback URL
  const result = await signIn(action.toLowerCase(), {
    callbackUrl,
  });

  if (result?.error) {
    console.error('Error during login:', result.error);
  }
}


export async function putJSONinDB(userId: number, studyPlan: any) {
  let studyPlanJSON: Prisma.InputJsonValue;
  if (typeof studyPlan === 'string') {
    try {
        studyPlanJSON = JSON.parse(studyPlan) as Prisma.InputJsonValue;
    } catch (error) {
        throw new Error("Invalid JSON format provided");
    }
} else {
    studyPlanJSON = studyPlan as Prisma.InputJsonValue;
}
  try {
    const updatedStudyPlan = await prismaClient.studyPlan.update({
      where: {
        userId: userId,  // Identify the study plan by userId
      },
      data: {
         planData: studyPlanJSON,    // Update the course name
      },
    });

    console.log("Updated StudyPlan:", updatedStudyPlan);
    return updatedStudyPlan;
  } catch (error) {
    console.error("Error updating StudyPlan:", error);
  }
}