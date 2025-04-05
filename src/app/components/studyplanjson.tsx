"use client";
// Import the necessary function to call the Gemini API
import { generateResponse } from "@/app/services/groqApi"; // Assume this function interacts with Gemini

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useEffect } from "react";

// Function to calculate days between today and the deadline
function calculateDaysUntilDeadline(deadline: string): number {
  const today = new Date();
  const endDate = new Date(deadline);
  const timeDiff = endDate.getTime() - today.getTime();
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
}

// Main function to generate the study plan
async function generateAIStudyPlan(course: string, deadline: string) {
  // Step 1: Calculate the number of days until the deadline
  const availableDays = calculateDaysUntilDeadline(deadline);

  // Step 2: Construct a prompt for Gemini to generate the study plan
  const prompt = `JSON FORMAT Generate a detailed study plan in JSON format for a student preparing for the ${course}. The student has ${availableDays} days to prepare for the exam. The plan should cover the entire syllabus comprehensively without missing any topics. The study plan should be divided into sections, where each day includes a list of topics from all/different subjects within the course. The output should include the day number, subject name, chapter, and sub-topics to be studied on that day. Ensure that every topic in the syllabus is covered, and no important area is overlooked. You can first gather all the syllabus from web for the particular course/exam and then generate result without missing out on a single topic
 `;

  //I have ${availableDays} days to prepare for the course "${course}". I am a complete beginner and do not have any prior knowledge about the course. Please create a daily study plan that divides the main topics, sub-topics, chapters, or key concepts into ${availableDays} days. Each day should have specific tasks or topics to study, ensuring a manageable and balanced learning experience. The plan should be designed so that each day includes only a small, digestible amount of content, gradually building up my understanding. Return the plan as an array of arrays, where each inner array contains the specific topics or tasks for each day, making sure there is a clear daily progression.

  // Step 3: Request the AI to generate the study plan using the prompt

  try {
    // Step 3: Request the AI to generate the study plan using the prompt
    const studyPlan = await generateResponse(prompt);

    // Attempt to convert the study plan to JSON format
    const studyPlanJSON = JSON.stringify(studyPlan, null, 2);

    // Step 4: Output or use the generated study plan
    console.log(studyPlanJSON);

    return studyPlanJSON;
  } catch (error) {
    // Handle errors that may occur during the generation or conversion process
    console.error("Error generating or converting study plan:", error);
    return null;
  }
}

// React component to trigger the study plan generation
const TryComponent = () => {
  useEffect(() => {
    // Example usage of the function
    generateAIStudyPlan("Mass Transfer", "2024-09-30").then((plan) => {
      // This will log the study plan once it is generated
      console.log(plan);
    });
  }, []);

  return (
    <>
  <div>Check the console for the generated study plan.</div>
  <Button onClick={()=>signOut()}>SignOut</Button>
  </>
)

};

export default TryComponent;
