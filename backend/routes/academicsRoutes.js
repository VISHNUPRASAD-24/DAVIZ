import express from 'express';
import Academics from '../../database/models/Academics.js';

const router = express.Router();

// Get all academic records (grouped or flat)
router.get('/', async (req, res) => {
  try {
    const records = await Academics.find();
    res.json(records);
  } catch (err) {
    console.error("API ERROR (GET /api/academics):", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get records for a specific student
router.get('/:roll', async (req, res) => {
  try {
    const records = await Academics.find({ roll: req.params.roll });
    res.json(records);
  } catch (err) {
    console.error("API ERROR (GET /api/academics/:roll):", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Add or update an academic record (Upsert)
router.post('/', async (req, res) => {
  try {
    const { roll, semester, subject, cycleTest1, cycleTest2, internal1, internal2, modelExam } = req.body;
    
    if (!roll || !semester || !subject) {
      return res.status(400).json({ success: false, message: "Roll, semester, and subject are required" });
    }

    const record = await Academics.findOneAndUpdate(
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

    res.status(201).json({ success: true, record });
  } catch (err) {
    console.error("API ERROR (POST /api/academics):", err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// Delete a record
router.delete('/:id', async (req, res) => {
  try {
    await Academics.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Record deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
