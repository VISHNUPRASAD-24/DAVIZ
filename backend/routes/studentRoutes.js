import express from 'express';
import Student from '../../database/models/Student.js';

const router = express.Router();

// Get all students with search and pagination
router.get("/", async (req, res) => {
  const { search, page = 1, limit = 10 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const limitNum = parseInt(limit);

  const matchQuery = search 
    ? { $or: [{ regNo: new RegExp(search, 'i') }, { name: new RegExp(search, 'i') }] }
    : {};

  try {
    const students = await Student.aggregate([
      { $match: matchQuery },
      { $skip: skip },
      { $limit: limitNum }
    ]);
    
    const count = await Student.countDocuments(matchQuery);
    
    res.json({
      success: true,
      total: count,
      totalPages: Math.ceil(count / limitNum),
      currentPage: parseInt(page),
      students
    });
  } catch (err) {
    console.error("API ERROR (GET students):", err);
    res.status(500).json({ success: false, message: "Server error while fetching students" });
  }
});

router.post("/", async (req, res) => {
  try {
    const student = new Student(req.body);
    const savedStudent = await student.save();
    res.status(201).json({ success: true, student: savedStudent });
  } catch (err) {
    console.error("API ERROR (POST students):", err);
    res.status(400).json({ success: false, error: err.message });
  }
});

// Bulk upload students
router.post("/bulk", async (req, res) => {
  try {
    const students = req.body;
    const result = await Student.insertMany(students, { ordered: false });
    res.status(201).json({ success: true, count: result.length });
  } catch (err) {
    console.error("API ERROR (POST bulk):", err);
    res.status(400).json({ success: false, message: err.message });
  }
});

router.put("/:regNo", async (req, res) => {
  try {
    const updatedStudent = await Student.findOneAndUpdate(
      { regNo: req.params.regNo },
      req.body,
      { new: true }
    );
    if (!updatedStudent) return res.status(404).json({ success: false, message: "Student not found" });
    
    res.json({ success: true, student: updatedStudent });
  } catch (err) {
    console.error("API ERROR (PUT student):", err);
    res.status(400).json({ success: false, message: err.message });
  }
});

router.delete("/:regNo", async (req, res) => {
  try {
    const deletedStudent = await Student.findOneAndDelete({ regNo: req.params.regNo });
    if (!deletedStudent) return res.status(404).json({ success: false, message: "Student not found" });
    res.json({ success: true, message: "Student deleted" });
  } catch (err) {
    console.error("API ERROR (DELETE student):", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/:regNo", async (req, res) => {
  try {
    const student = await Student.findOne({ regNo: req.params.regNo });
    if (student) {
      res.json({ success: true, student });
    } else {
      res.status(404).json({ success: false, message: "Student not found" });
    }
  } catch (error) {
    console.error("API ERROR (GET student by regNo):", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Alias for AI Chatbot
router.get("/student/:regNo", async (req, res) => {
  try {
    const student = await Student.findOne({ regNo: req.params.regNo });
    if (student) {
      res.json(student);
    } else {
      res.status(404).json({ success: false, message: "Student not found" });
    }
  } catch (error) {
    console.error("API ERROR (GET student alias):", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;