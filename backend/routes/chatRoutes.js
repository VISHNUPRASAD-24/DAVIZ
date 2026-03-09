import express from 'express';
import { getStudentData } from '../services/studentQueryService.js';

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message, rollNo } = req.body;
    const studentQuery = (message || "").toLowerCase();
    
    // Support either rollNo or roll (standardizing on roll)
    const studentRoll = rollNo || req.body.roll || req.body.rollNumber;
    
    // 1. Intent Detection
    const intentKeywords = ['attendance', 'cgpa', 'marks', 'internal', 'timetable', 'result', 'schedule', 'gpa'];
    const hasAcademicIntent = intentKeywords.some(keyword => studentQuery.includes(keyword));

    let studentContext = "No specific academic data requested or available.";
    let studentName = "Student";

    if (hasAcademicIntent && studentRoll) {
       const studentData = await getStudentData(studentRoll);
       if (studentData) {
          studentName = studentData.name;
          studentContext = `
            Student Profile:
            Name: ${studentData.name}
            Department: ${studentData.department}
            Semester: ${studentData.semester}
            Attendance Percentage: ${studentData.attendance}
            Current CGPA: ${studentData.cgpa}
            Internal Marks: ${studentData.internalMarks}
            Upcoming Timetable: ${studentData.timetable}
            Scheduled Exams: ${studentData.exams}
          `.trim();
       } else {
          studentContext = "Student record not found in database. Advise the user to check their roll number.";
       }
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      console.error("Critical: OPENROUTER_API_KEY is missing from environment variables.");
      return res.status(500).json({ reply: "I'm having trouble authenticating with my AI service. Please contact the administrator." });
    }

    const prompt = `
You are DAVIZ, the official AI Student Assistant for the college.
Current Student Name: ${studentName}

CONSTRAINTS:
1. Speak in a friendly, conversational, and helpful manner.
2. Keep responses very short (2-3 sentences maximum).
3. Groundedness: Use ONLY the "Student Academic Data" provided below for academic queries. 
4. DO NOT GUESS or hallucinate any numbers (attendance, marks, etc.) if they are missing or "No academic data available yet.".
5. If data is missing for a specific query, politely inform the student that it's not currently available in the system.

Student Academic Data:
${studentContext}

User Question:
"${message}"

Response:
    `.trim();

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "DAVIZ AI Assistant"
      },
      body: JSON.stringify({
        "model": "anthropic/claude-3-haiku",
        "messages": [
          { "role": "user", "content": prompt }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenRouter API Error:", errorData);
      throw new Error("Failed to get response from AI service");
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    return res.json({ reply });

  } catch (error) {
    console.error("API ERROR (POST chat):", error);
    res.status(500).json({ reply: "I'm having a bit of trouble connecting to my brain right now. Can you try again?" });
  }
});

export default router;
