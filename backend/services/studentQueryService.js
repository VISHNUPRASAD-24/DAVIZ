import Student from '../../database/models/Student.js';
import Attendance from '../../database/models/Attendance.js';
import Marks from '../../database/models/Marks.js';
import Timetable from '../../database/models/Timetable.js';
import Exam from '../../database/models/Exam.js';
import Notice from '../../database/models/Notice.js';

/**
 * Aggregates student academic and profile data for AI Chatbot context.
 * @param {string} regNo - The registration number of the student.
 * @returns {Object|null} - The aggregated student data or null if not found.
 */
export const getStudentData = async (regNo) => {
  try {
    const normalizedRegNo = (regNo || "").toUpperCase();
    
    // 1. Fetch Basic Profile
    const student = await Student.findOne({ regNo: normalizedRegNo });
    if (!student) return null;

    // 2. Fetch Attendance Summary
    const attendanceRecords = await Attendance.find({ regNo: normalizedRegNo });
    const attendanceSummary = attendanceRecords.length > 0
      ? attendanceRecords.map(a => `${a.subject}: ${a.percentage}% (${a.hoursPresent}/${a.hoursConducted} hrs)`).join(' | ')
      : 'No attendance data available.';

    // 3. Fetch Marks Details
    const marksRecords = await Marks.find({ regNo: normalizedRegNo });
    const marksSummary = marksRecords.length > 0
      ? marksRecords.map(m => `${m.subject}: [Cycle1: ${m.cycle1 || '-'}, Cycle2: ${m.cycle2 || '-'}, Internal1: ${m.internal1 || '-'}, Internal2: ${m.internal2 || '-'}, Model: ${m.model || '-'}, Total: ${m.total || '-'}]`).join(' | ')
      : 'No marks data available.';

    // 4. Fetch Timetable
    const timetableRecords = await Timetable.find({ 
      department: student.department,
      semester: student.semester 
    }).sort({ day: 1, time: 1 });

    const timetable = timetableRecords.length > 0
      ? timetableRecords.map(t => `${t.day} ${t.time}: ${t.subject} (${t.faculty})`).join(' | ')
      : 'No timetable scheduled.';
    
    // 5. Fetch Upcoming Exams
    const examRecords = await Exam.find({
      department: student.department,
      semester: student.semester,
      date: { $gte: new Date() }
    }).sort({ date: 1 });

    const exams = examRecords.length > 0
      ? examRecords.map(e => `${new Date(e.date).toLocaleDateString()} ${e.time}: ${e.subject} (Hall: ${e.hall}, Type: ${e.type})`).join(' | ')
      : 'No upcoming exams.';

    // 6. Fetch Recent Notices
    const notices = await Notice.find({
      $or: [
        { targetDepartment: student.department },
        { targetDepartment: 'All' },
        { targetDepartment: [] }
      ]
    }).sort({ createdAt: -1 }).limit(3);

    const noticeSummary = notices.length > 0
      ? notices.map(n => `[${n.category}] ${n.title}: ${n.content}`).join(' | ')
      : 'No active notices.';

    return {
      regNo: student.regNo,
      name: student.name,
      department: student.department,
      semester: student.semester,
      section: student.section,
      attendanceSummary,
      marksSummary,
      timetable,
      exams,
      notices: noticeSummary
    };

  } catch (error) {
    console.error("Error in getStudentData:", error);
    return null;
  }
};
