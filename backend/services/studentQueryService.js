import Student from '../../database/models/Student.js';
import Attendance from '../../database/models/Attendance.js';
import Marks from '../../database/models/Marks.js';
import Timetable from '../../database/models/Timetable.js';
import Exam from '../../database/models/Exam.js';

/**
 * Aggregates student academic and profile data for AI Chatbot context.
 * @param {string} rollNumber - The roll number of the student.
 * @returns {Object|null} - The aggregated student data or null if not found.
 */
export const getStudentData = async (rollNumber) => {
  try {
    const normalizedRoll = (rollNumber || "").toUpperCase();
    
    // 1. Fetch Basic Profile
    const student = await Student.findOne({ roll: normalizedRoll });
    if (!student) return null;

    // 2. Fetch Attendance and calculate percentage
    const attendanceRecords = await Attendance.find({ roll: normalizedRoll });
    const attendanceCount = attendanceRecords.length;
    const presentCount = attendanceRecords.filter(a => a.status === 'Present').length;
    const attendancePercentage = attendanceCount > 0 
      ? ((presentCount / attendanceCount) * 100).toFixed(1) + '%' 
      : 'No academic data available yet.';

    // 3. Fetch Marks and calculate CGPA
    const marksRecords = await Marks.find({ roll: normalizedRoll });
    let totalPoints = 0;
    let totalCredits = 0;
    const internalMarksList = [];

    marksRecords.forEach(m => {
      totalPoints += (m.marks / 10) * m.credits;
      totalCredits += m.credits;
      if (m.examType === 'Internal') {
        internalMarksList.push(`${m.subject}: ${m.marks}`);
      }
    });

    const cgpa = totalCredits > 0 
      ? (totalPoints / totalCredits).toFixed(2) 
      : 'No academic data available yet.';
    
    const internalMarks = internalMarksList.length > 0 
      ? internalMarksList.join(', ') 
      : 'No academic data available yet.';

    // 4. Fetch Timetable for the student's Dept and Semester
    const timetableRecords = await Timetable.find({ 
      department: student.department,
      semester: student.semester 
    }).sort({ day: 1, time: 1 });

    const timetable = timetableRecords.length > 0
      ? timetableRecords.map(t => `${t.day} (${t.time}): ${t.subject} in ${t.faculty}`).join(' | ')
      : 'No timetable scheduled';
    
    // 5. Fetch Upcoming Exams
    const examRecords = await Exam.find({
      department: student.department,
      semester: student.semester,
      date: { $gte: new Date() }
    }).sort({ date: 1 });

    const exams = examRecords.length > 0
      ? examRecords.map(e => `${new Date(e.date).toLocaleDateString()} (${e.time}): ${e.subject} @ ${e.hall} [${e.type}]`).join(' | ')
      : 'No upcoming exams scheduled';

    return {
      roll: student.roll,
      name: student.name,
      department: student.department,
      semester: student.semester,
      attendance: attendancePercentage,
      cgpa: cgpa,
      internalMarks: internalMarks,
      timetable: timetable,
      exams: exams
    };

  } catch (error) {
    console.error("Error in getStudentData:", error);
    return null;
  }
};
