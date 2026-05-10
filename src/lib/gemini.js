import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

export const generateQuestions = async (subjectContext) => {
  if (!apiKey) {
    console.error("Gemini API key is not configured");
    return [];
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `You are an expert ICT teacher. Generate a completely unique and challenging 10-question multiple choice quiz for the subject: ${subjectContext}. 
Respond strictly in valid JSON array format, nothing else. No markdown wrappers around the JSON.
Each object in the array must have exactly the following keys:
"id": an integer from 1 to 10
"text": the question string
"options": an array of 4 different possible answer strings
"correct": the integer index (0-3) of the correct answer in the options array.

Ensure questions are high quality and vary in difficulty.`;

  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text();
    // Safely remove markdown JSON ticks if present
    if (text.startsWith("\`\`\`json")) text = text.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
    if (text.startsWith("\`\`\`")) text = text.replace(/\`\`\`/g, "").trim();
    
    const questions = JSON.parse(text);
    return questions;
  } catch (error) {
    console.error("Failed to generate questions", error);
    throw new Error("AI Question Generation Failed");
  }
};
