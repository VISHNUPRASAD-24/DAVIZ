import express from 'express';
import Attendance from '../../database/models/Attendance.js';

const router = express.Router();

// Get all attendance records
router.get('/', async (req, res) => {
  try {
    const attendance = await Attendance.find().sort({ date: -1 });
    res.json(Array.isArray(attendance) ? attendance : []);
  } catch (err) {
    console.error("API ERROR (GET attendance):", err);
    res.status(500).json([]);
  }
});

// Get attendance for a specific student
router.get('/student/:roll', async (req, res) => {
  try {
    const attendance = await Attendance.find({ roll: req.params.roll });
    res.json(Array.isArray(attendance) ? attendance : []);
  } catch (err) {
    console.error("API ERROR (GET attendance by roll):", err);
    res.status(500).json([]);
  }
});

// Mark attendance (Upsert)
router.post('/', async (req, res) => {
  try {
    const { roll, subject, date, status } = req.body;
    
    // Normalize date to start of day for comparison
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    const updatedAttendance = await Attendance.findOneAndUpdate(
      { 
        roll, 
        subject, 
        date: {
          $gte: normalizedDate,
          $lt: new Date(normalizedDate.getTime() + 24 * 60 * 60 * 1000)
        }
      },
      { roll, subject, date, status },
      { upsert: true, new: true, runValidators: true }
    );

    res.status(201).json({ success: true, attendance: updatedAttendance });
  } catch (err) {
    console.error("API ERROR (POST attendance):", err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// Bulk mark attendance
router.post('/bulk', async (req, res) => {
  try {
    const records = req.body; // Expecting an array of attendance objects
    const result = await Attendance.insertMany(records);
    res.status(201).json({ success: true, count: result.length });
  } catch (err) {
    console.error("API ERROR (POST bulk attendance):", err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// Calculate attendance percentage for a student
router.get('/percentage/:roll', async (req, res) => {
  try {
    const roll = req.params.roll;
    const totalSessions = (await Attendance.countDocuments({ roll })) || 0;
    const presentSessions = (await Attendance.countDocuments({ roll, status: 'Present' })) || 0;
    
    const percentage = totalSessions > 0 ? (presentSessions / totalSessions) * 100 : 0;
    res.json({ success: true, roll, totalSessions, presentSessions, percentage: percentage.toFixed(2) });
  } catch (err) {
    console.error("API ERROR (GET attendance percentage):", err);
    res.status(500).json({ success: false, message: "Server error", percentage: "0.00" });
  }
});

export default router;
