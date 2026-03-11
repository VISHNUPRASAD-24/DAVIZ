import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });
console.log("-----------------------------------------");
console.log("OpenRouter Key:", process.env.OPENROUTER_API_KEY ? "✅ Loaded" : "❌ Missing");
console.log("-----------------------------------------");

import studentRoutes from "./routes/studentRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import timetableRoutes from "./routes/timetableRoutes.js";
import examRoutes from "./routes/examRoutes.js";
import feeRoutes from "./routes/feeRoutes.js";
import noticeRoutes from "./routes/noticeRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import marksRoutes from "./routes/marksRoutes.js";
import academicsRoutes from "./routes/academicsRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import importRoutes from "./routes/importRoutes.js";
import { getStudentData } from './services/studentQueryService.js';

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("DAVIZ backend is running");
});

app.use("/api/students", studentRoutes);
app.use("/chat", chatRoutes); // Primary chat endpoint
app.use("/api/chat", chatRoutes); // API alias
app.use("/api/timetable", timetableRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/marks", marksRoutes);
app.use("/api/academics", academicsRoutes);
app.use("/api/import", importRoutes);

// Direct Aliases for AI Chatbot
app.get("/api/student/:regNo", async (req, res) => {
  try {
    const data = await getStudentData(req.params.regNo);
    if (data) {
      res.json(data);
    } else {
      res.status(404).json({ message: "Student not found" });
    }
  } catch (err) { 
    console.error("Error in /api/student alias:", err);
    res.status(500).json({ error: err.message }); 
  }
});

app.get("/api/attendance/:regNo", async (req, res) => {
  try {
    const Attendance = (await import('../database/models/Attendance.js')).default;
    const records = await Attendance.find({ regNo: req.params.regNo });
    res.json(records || []);
  } catch (err) { res.status(500).json([]); }
});

app.get("/api/academics/:regNo", async (req, res) => {
  try {
    const Marks = (await import('../database/models/Marks.js')).default;
    const records = await Marks.find({ regNo: req.params.regNo });
    res.json(records || []);
  } catch (err) { res.status(500).json([]); }
});

app.use("/api/analytics", analyticsRoutes);

const PORT = 5000;

mongoose
  .connect("mongodb://127.0.0.1:27017/daviz")
  .then(() => {
    console.log("-----------------------------------------");
    console.log("✅ MongoDB Connected Successfully");
    console.log("📡 Database: daviz");
    console.log("-----------------------------------------");

    app.listen(PORT, () => {
      console.log(`🚀 DAVIZ Server running on port ${PORT}`);
      console.log(`🔗 API Endpoint: http://localhost:${PORT}/api`);
      console.log("-----------------------------------------");
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    console.log("Please ensure MongoDB is installed and running on 127.0.0.1:27017");
  });
