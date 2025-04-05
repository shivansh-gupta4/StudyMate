"use client"; 

import { Groq } from 'groq-sdk';

export async function generateResponse(userInput: string): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("API key is missing. Please set NEXT_PUBLIC_GROQ_API_KEY in your .env.local file.");
  }

  // WARNING: This allows the SDK to run in the browser, which poses security risks.
  // In a production environment, you should use a backend API to handle Groq requests.
  const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });

  try {
    console.log("Sending request to Groq API...");

    const chatCompletion = await groq.chat.completions.create({
      "messages": [
        {
          "role": "user",
          "content": userInput
        }
      ],
      "model": "llama3-8b-8192",
      "temperature": 0.22,
      "max_tokens": 8192,
      "top_p": 1,
      "stream": false,
      "response_format": {
        "type": "json_object"
      },
      "stop": null
    });

    

    if (!chatCompletion.choices || chatCompletion.choices.length === 0) {
      throw new Error("No choices in API response");
    }

    const content = chatCompletion.choices[0].message.content;
    if (content == null) {
      throw new Error("Null or undefined content in API response");
    }
    console.log("Received response from Groq API:", content);
    // The response should already be in JSON format
    return content;

  } catch (error) {
    console.error("Detailed error in generateResponse:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate response: ${error.message}`);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}
