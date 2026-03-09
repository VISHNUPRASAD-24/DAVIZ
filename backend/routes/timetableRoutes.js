import express from 'express';
import Timetable from '../../database/models/Timetable.js';

const router = express.Router();

// Get all timetable entries
router.get('/', async (req, res) => {
  try {
    const timetable = await Timetable.find();
    res.json(Array.isArray(timetable) ? timetable : []);
  } catch (error) {
    console.error("API ERROR (GET timetable):", error);
    res.status(500).json([]);
  }
});

// Create timetable entry
router.post('/', async (req, res) => {
  try {
    const entry = new Timetable(req.body);
    const newEntry = await entry.save();
    res.status(201).json({ success: true, entry: newEntry });
  } catch (error) {
    console.error("API ERROR (POST timetable):", error);
    res.status(400).json({ success: false, message: error.message });
  }
});

router.post('/bulk', async (req, res) => {
  try {
    const result = await Timetable.insertMany(req.body, { ordered: false });
    res.status(201).json({ success: true, count: result.length });
  } catch (error) {
    console.error("API ERROR (POST bulk timetable):", error);
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
