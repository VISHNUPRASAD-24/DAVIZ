import { collegeKnowledge } from '../../src/knowledge/collegeData.js';
import dotenv from 'dotenv';

// Load env explicitly here because this might be used independently, though server.js already loads it.
dotenv.config();

export const searchKnowledge = (question) => {
  const q = question.toLowerCase();
  
  const results = collegeKnowledge.filter(item => {
    // Basic keyword extraction matching from topic
    const topicKeywords = item.topic.toLowerCase().split(' ');
    
    // Check if the raw topic word is directly in the question
    if (q.includes(item.topic.toLowerCase())) {
      return true;
    }

    // Check if any keyword of length > 2 is in the question
    return topicKeywords.some(keyword => keyword.length > 2 && q.includes(keyword));
  });

  if (results.length > 0) {
    return results.map(r => r.content).join('\n');
  }

  return "No general college information was found relevant to this query.";
};

export const generateAIResponse = async (question) => {
  // Use VITE_OPENROUTER_API_KEY from .env (since the frontend framework Vite used this prefix)
  const API_KEY = process.env.VITE_OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY; 

  const retrievedData = searchKnowledge(question);

  const prompt = `
You are DAVIZ, a friendly AI academic assistant for students.

If the student greets you (hello, hi, hey), respond politely.

If the question is academic, use the provided college information.

Relevant College Information:
${retrievedData}

Student Question:
${question}

Rules:
- If greeting → respond normally.
- If academic question → answer using the information.
- If information not found → say "I couldn't find that information in the system."
`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    const data = await response.json();
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content;
    } else {
      console.warn("Unexpected API response structure:", data);
      return "I could not generate a response based on the current context.";
    }

  } catch (error) {
    console.error("AI Service Error:", error);
    return "AI error occurred while contacting the language model.";
  }
};
