import express from 'express';
import Student from '../../database/models/Student.js';
import AcademicRecord from '../../database/models/AcademicRecord.js';
import Subject from '../../database/models/Subject.js';
import Exam from '../../database/models/Exam.js';
import Notice from '../../database/models/Notice.js';

const router = express.Router();

router.get('/overview', async (req, res) => {
  try {
    const totalStudents = (await Student.countDocuments()) || 0;
    const totalSubjects = (await Subject.countDocuments()) || 0;
    
    // Aggregate data from AcademicRecord
    const academicStats = await AcademicRecord.aggregate([
      {
        $group: {
          _id: null,
          avgMarks: { $avg: "$marks" },
          avgAttendance: { $avg: "$attendancePercent" }
        }
      }
    ]);

    const averageMarks = academicStats.length > 0 ? academicStats[0].avgMarks.toFixed(1) : 0;
    const averageAttendance = academicStats.length > 0 ? academicStats[0].avgAttendance.toFixed(1) : 0;

    const upcomingExams = await Exam.countDocuments({ date: { $gte: new Date() } });
    const notices = await Notice.countDocuments();

    res.json({
      totalStudents,
      totalSubjects,
      averageMarks,
      averageAttendance,
      upcomingExams,
      notices
    });

  } catch (err) {
    console.error("API ERROR (GET analytics):", err);
    res.json({ 
      totalStudents: 0,
      totalSubjects: 0,
      averageMarks: 0,
      averageAttendance: 0
    });
  }
});

export default router;
