import express from 'express';
import Attendance from '../../database/models/Attendance.js';
import Student from '../../database/models/Student.js';

const router = express.Router();

// Get all attendance records with student details
router.get('/', async (req, res) => {
  try {
    const filter = {};

    if (req.query.regNo) {
      filter.regNo = req.query.regNo;
    }

    if (req.query.subject) {
      filter.subject = req.query.subject;
    }

    const attendance = await Attendance.find(filter);

    // Map eligibility field for ease of frontend consumption
    const attendanceWithEligibility = attendance.map(rec => ({
      ...rec.toObject(),
      eligibility: rec.percentage >= 75 ? 'Eligible' : 'Detained'
    }));

    res.json({
      success: true,
      count: attendanceWithEligibility.length,
      data: attendanceWithEligibility
    });
  } catch (err) {
    console.error("API ERROR (GET attendance):", err);
    res.status(500).json({ success: false, data: [] });
  }
});

// Get attendance for a specific student
router.get('/student/:regNo', async (req, res) => {
  try {
    const attendance = await Attendance.find({ regNo: req.params.regNo });
    res.json({ success: true, data: attendance });
  } catch (err) {
    console.error("API ERROR (GET attendance by regNo):", err);
    res.status(500).json({ success: false, data: [] });
  }
});

export default router;
