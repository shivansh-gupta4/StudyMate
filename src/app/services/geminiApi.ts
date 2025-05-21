"use client";

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("API key is missing. Please set NEXT_PUBLIC_GEMINI_API_KEY in your .env.local file.");
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Function to generate a response from the AI
export async function generateResponse(userInput: string): Promise<string> {
  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(userInput);
    return result.response.text();
  } catch (error) {
    console.error("Error generating response:", error);
    throw new Error("Failed to generate response");
  }
}


