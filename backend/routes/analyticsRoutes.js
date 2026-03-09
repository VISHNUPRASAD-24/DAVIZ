import express from 'express';
import Student from '../../database/models/Student.js';
import Attendance from '../../database/models/Attendance.js';
import Marks from '../../database/models/Marks.js';
import Exam from '../../database/models/Exam.js';
import Notice from '../../database/models/Notice.js';

const router = express.Router();

router.get('/overview', async (req, res) => {
  try {
    const totalStudents = (await Student.countDocuments()) || 0;
    
    // Attendance Analytics
    const attendanceStats = await Attendance.aggregate([
      {
        $group: {
          _id: "$roll",
          total: { $sum: 1 },
          present: { $sum: { $cond: [{ $eq: ["$status", "Present"] }, 1, 0] } }
        }
      },
      {
        $project: {
          percentage: { 
            $cond: [
              { $eq: ["$total", 0] }, 
              0, 
              { $multiply: [{ $divide: ["$present", "$total"] }, 100] }
            ]
          }
        }
      }
    ]);

    const avgAttendance = attendanceStats.length > 0
      ? parseFloat((attendanceStats.reduce((acc, curr) => acc + curr.percentage, 0) / attendanceStats.length).toFixed(1))
      : 0;

    const atRiskStudents = attendanceStats.filter(s => s.percentage < 75).length;

    const attendanceDistribution = [
      { name: '90-100%', value: attendanceStats.filter(s => s.percentage >= 90).length },
      { name: '80-90%', value: attendanceStats.filter(s => s.percentage >= 80 && s.percentage < 90).length },
      { name: '70-80%', value: attendanceStats.filter(s => s.percentage >= 70 && s.percentage < 80).length },
      { name: 'Below 70%', value: attendanceStats.filter(s => s.percentage < 70).length }
    ];

    // CGPA Analytics
    const cgpaStats = await Marks.aggregate([
      {
        $group: {
          _id: "$roll",
          totalPoints: { $sum: { $multiply: [{ $divide: ["$marks", 10] }, "$credits"] } },
          totalCredits: { $sum: "$credits" }
        }
      },
      {
        $project: {
          cgpa: { 
            $cond: [
              { $eq: ["$totalCredits", 0] }, 
              0, 
              { $divide: ["$totalPoints", "$totalCredits"] }
            ]
          }
        }
      }
    ]);

    const avgCGPA = cgpaStats.length > 0
      ? parseFloat((cgpaStats.reduce((acc, curr) => acc + curr.cgpa, 0) / cgpaStats.length).toFixed(2))
      : 0;

    const cgpaDistribution = [
      { name: '9-10', value: cgpaStats.filter(s => s.cgpa >= 9).length },
      { name: '8-9', value: cgpaStats.filter(s => s.cgpa >= 8 && s.cgpa < 9).length },
      { name: '7-8', value: cgpaStats.filter(s => s.cgpa >= 7 && s.cgpa < 8).length },
      { name: 'Below 7', value: cgpaStats.filter(s => s.cgpa < 7).length }
    ];

    // Counts for user request
    const upcomingExams = await Exam.countDocuments({ date: { $gte: new Date() } });
    const notices = await Notice.countDocuments();

    res.json({
      totalStudents,
      avgAttendance,
      averageAttendance: avgAttendance, // Alias
      avgCGPA,
      atRiskStudents,
      upcomingExams,
      notices,
      distributions: {
        attendance: attendanceDistribution,
        cgpa: cgpaDistribution
      }
    });

  } catch (err) {
    console.error("API ERROR (GET analytics):", err);
    res.json({ 
      totalStudents: 0,
      avgAttendance: 0,
      avgCGPA: 0,
      atRiskStudents: 0,
      distributions: { attendance: [], cgpa: [] }
    });
  }
});

export default router;
