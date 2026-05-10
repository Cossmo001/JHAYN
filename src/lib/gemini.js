import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

export const generateQuestions = async (subjectContext) => {
  if (!apiKey) {
    console.error("Gemini API key is not configured");
    throw new Error("Missing API Key: Please check Vercel environment variables.");
  }

  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
    }
  });

  const prompt = `You are an expert ICT teacher. Generate a completely unique and challenging 10-question multiple choice quiz for the subject: ${subjectContext}. 
Respond strictly in a JSON array format.
Each object in the array must have exactly the following keys:
"id": an integer from 1 to 10
"text": the question string
"options": an array of 4 different possible answer strings
"correct": the integer index (0-3) of the correct answer in the options array.`;

  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text();
    
    // Final safety check for any markdown wrapping (though application/json should prevent it)
    text = text.replace(/^```json/, '').replace(/```$/, '').trim();
    
    const questions = JSON.parse(text);
    return questions;
  } catch (error) {
    console.error("Failed to generate questions:", error);
    if (error.message?.includes("API_KEY_INVALID")) {
      throw new Error("Invalid API Key: Please update VITE_GEMINI_API_KEY.");
    }
    throw new Error(`AI generation failed: ${error.message || "Unknown error"}`);
  }
};
