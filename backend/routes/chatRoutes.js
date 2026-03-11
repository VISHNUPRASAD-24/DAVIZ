import express from 'express';
import { getStudentData } from '../services/studentQueryService.js';

const router = express.Router();

/**
 * Detects if the user query is about academic data.
 */
const isAcademicQuery = (text) => {
  const keywords = [
    'mark', 'attendance', 'timetable', 'schedule', 'exam', 'result', 
    'cgpa', 'subject', 'notice', 'internal', 'model', 'cycle', 
    'holiday', 'event', 'profile', 'who am i', 'my details'
  ];
  const lowerText = text.toLowerCase();
  return keywords.some(k => lowerText.includes(k));
};

router.post("/", async (req, res) => {
  try {
    const { message, rollNo, regNo } = req.body;
    const studentId = rollNo || regNo;

    console.log(`[Chat] Incoming message from ${studentId || 'unknown'}: "${message}"`);

    if (!message) {
      return res.json({ reply: "Please ask a question." });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error("[Error] Missing OPENROUTER_API_KEY in .env");
      return res.json({ reply: "AI service is not configured. Please contact admin." });
    }

    // 1. Intent Detection & Database Inquiry
    if (isAcademicQuery(message)) {
      if (!studentId || studentId === 'unknown') {
        return res.json({ 
          reply: "I can help with that! Please log in so I can access your student records." 
        });
      }

      console.log(`[Intent] Academic query detected. Fetching records for ${studentId}...`);
      const studentData = await getStudentData(studentId);

      if (studentData) {
        console.log(`[Success] Database records found for ${studentId}. Formatting with AI...`);
        
        // Use student data for AI context
        const studentContext = `
          Name: ${studentData.name}
          Reg No: ${studentData.regNo}
          Department: ${studentData.department} | Semester: ${studentData.semester} | Section: ${studentData.section}
          
          ATTENDANCE SUMMARY:
          ${studentData.attendanceSummary}
          
          ACADEMIC MARKS:
          ${studentData.marksSummary}
          
          TIMETABLE:
          ${studentData.timetable}
          
          UPCOMING EXAMS:
          ${studentData.exams}
          
          RECENT NOTICES:
          ${studentData.notices}
        `;

        const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "openai/gpt-4o-mini",
            messages: [
              { 
                role: "system", 
                content: `You are DAVIZ, an AI Academic Assistant for a college student management system.
                
                Current Student Name: ${studentData.name}
                
                You are provided with the student's academic data below. You must use ONLY this data to answer questions.
                
                STUDENT ACADEMIC DATA:
                ${studentContext}
                
                RULES:
                1. Always greet the student using their name.
                2. Answer ONLY what the student asks.
                3. Do NOT show all marks unless the user asks for all marks.
                4. If the student asks for internal marks, return ONLY Internal 1 and Internal 2.
                5. If the student asks for model marks, return ONLY the Model mark.
                6. If the student asks for cycle marks, return ONLY Cycle 1 and Cycle 2.
                7. If the student asks for total marks, return ONLY the total.
                8. If the student asks generally about marks, show the full breakdown.
                9. Never invent marks. Only use the data provided.
                10. If the requested information does not exist, politely say the data is unavailable.
                
                FORMAT RESPONSES CLEARLY and keep them short, clear, and academic.` 
              },
              { role: "user", content: message }
            ]
          })
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          const reply = aiData?.choices?.[0]?.message?.content || "Data found, but I failed to format it.";
          return res.json({ reply });
        }
      } else {
         console.log(`[Note] No records found for ${studentId}.`);
         return res.json({ reply: "I couldn't find any academic records for your registration number." });
      }
    }

    // 2. OpenRouter AI Fallback for General Queries
    console.log("[AI] Forwarding general query to OpenRouter...");
    const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          { 
            role: "system", 
            content: "You are DAVIZ, a professional AI Academic Assistant. Answer general questions about college life politely. If the user asks for personal academic data, remind them you can provide that once they are logged in and ask specifically." 
          },
          { role: "user", content: message }
        ]
      })
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("[AI Error]", errorText);
      return res.json({ reply: "AI service temporarily unavailable. Please try again later." });
    }

    const aiData = await aiResponse.json();
    const reply = aiData?.choices?.[0]?.message?.content || "I couldn't generate a response. How else can I help?";

    return res.json({ reply });

  } catch (error) {
    console.error("[Critical] Chat Route Error:", error);
    return res.json({ reply: "An internal server error occurred. Our team has been notified." });
  }
});

export default router;
