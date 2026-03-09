import express from 'express';
import Marks from '../../database/models/Marks.js';

const router = express.Router();

// Get all marks
router.get('/', async (req, res) => {
  try {
    const marks = await Marks.find();
    res.json(Array.isArray(marks) ? marks : []);
  } catch (err) {
    console.error("API ERROR (GET marks):", err);
    res.status(500).json([]);
  }
});

// Get marks for a specific student
router.get('/student/:roll', async (req, res) => {
  try {
    const marks = await Marks.find({ roll: req.params.roll });
    res.json(Array.isArray(marks) ? marks : []);
  } catch (err) {
    console.error("API ERROR (GET marks by roll):", err);
    res.status(500).json([]);
  }
});

// Add or update marks (Upsert)
router.post('/', async (req, res) => {
  try {
    const { roll, semester, subject, cycleTest1, cycleTest2, internal1, internal2, modelExam } = req.body;
    
    if (!roll || !semester || !subject) {
      return res.status(400).json({ success: false, message: "Roll, semester, and subject are required" });
    }

    const marksEntry = await Marks.findOneAndUpdate(
      { roll, semester, subject },
      { 
        roll, 
        semester, 
        subject, 
        cycleTest1: Number(cycleTest1) || 0, 
        cycleTest2: Number(cycleTest2) || 0, 
        internal1: Number(internal1) || 0, 
        internal2: Number(internal2) || 0, 
        modelExam: Number(modelExam) || 0 
      },
      { upsert: true, new: true }
    );

    res.status(201).json({ success: true, marks: marksEntry });
  } catch (err) {
    console.error("API ERROR (POST marks):", err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// Bulk add marks
router.post('/bulk', async (req, res) => {
  try {
    const records = req.body;
    const result = await Marks.insertMany(records);
    res.status(201).json({ success: true, count: result.length });
  } catch (err) {
    console.error("API ERROR (POST bulk marks):", err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// Get records for a specific student
router.get('/:roll', async (req, res) => {
  try {
    const records = await Marks.find({ roll: req.params.roll });
    res.json(records);
  } catch (err) {
    console.error("API ERROR (GET marks by roll):", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
