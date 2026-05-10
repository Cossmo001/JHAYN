export const generateGroqQuestions = async (subjectContext) => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("Missing Groq API Key");
  }

  const prompt = `You are an expert ICT teacher. Generate a completely unique and challenging 10-question multiple choice quiz for the subject: ${subjectContext}. 
Respond strictly in valid JSON array format, nothing else. No markdown wrappers around the JSON.
Each object in the array must have exactly the following keys:
"id": an integer from 1 to 10
"text": the question string
"options": an array of 4 different possible answer strings
"correct": the integer index (0-3) of the correct answer in the options array.

Ensure questions are high quality and vary in difficulty.`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that only responds with valid JSON arrays."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Groq API Error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    let text = data.choices[0].message.content;
    
    // In Llama, sometimes it returns an object with a "questions" key even if we ask for an array.
    // To handle "json_object" mode correctly (which mandates a root object in some APIs),
    // we might need to parse and check if it's already an array or wrapped.
    let parsed = JSON.parse(text);
    if (!Array.isArray(parsed) && parsed.questions) {
      parsed = parsed.questions;
    } else if (!Array.isArray(parsed) && parsed.quiz) {
      parsed = parsed.quiz;
    }
    
    if (!Array.isArray(parsed)) {
       // If it's still not an array but an object where values are the quiz, try to extract first array found
       const possibleArray = Object.values(parsed).find(v => Array.isArray(v));
       if (possibleArray) parsed = possibleArray;
    }

    return parsed;
  } catch (error) {
    console.error("Groq Generation Failed:", error);
    throw error;
  }
};
