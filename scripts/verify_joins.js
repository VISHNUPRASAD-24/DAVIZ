import mongoose from 'mongoose';
import Student from '../database/models/Student.js';
import Subject from '../database/models/Subject.js';
import AcademicRecord from '../database/models/AcademicRecord.js';
import dotenv from 'dotenv';

dotenv.config();

const test = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/daviz_sis");
    console.log("Connected to MongoDB.");

    // 1. Create a test student
    const regNo = "TEST123456";
    await Student.findOneAndUpdate(
      { regNo },
      { name: "Test Student", department: "CSE", year: 3, section: "A", dob: "2000-01-01" },
      { upsert: true, new: true }
    );
    console.log("Test student created/updated.");

    // 2. Create a test subject
    const subjectCode = "CS101";
    await Subject.findOneAndUpdate(
      { subjectCode },
      { subjectName: "Computer Science 101", semester: 1, department: "CSE" },
      { upsert: true, new: true }
    );
    console.log("Test subject created/updated.");

    // 3. Create an academic record
    await AcademicRecord.findOneAndUpdate(
      { regNo, subjectCode, semester: 1 },
      { marks: 85, attendanceHours: 40, attendancePercent: 90 },
      { upsert: true, new: true }
    );
    console.log("Academic record created/updated.");

    // 4. Test the join (Academics API logic)
    const academics = await AcademicRecord.aggregate([
      {
        $lookup: {
          from: 'students',
          localField: 'regNo',
          foreignField: 'regNo',
          as: 'student'
        }
      },
      { $unwind: '$student' },
      {
        $lookup: {
          from: 'subjects',
          localField: 'subjectCode',
          foreignField: 'subjectCode',
          as: 'subject'
        }
      },
      { $unwind: '$subject' },
      {
        $project: {
          regNo: 1,
          studentName: '$student.name',
          subjectCode: 1,
          subjectName: '$subject.subjectName',
          semester: 1,
          marks: 1,
          attendancePercent: 1
        }
      }
    ]);

    console.log("Join result (Academics):", JSON.stringify(academics[0], null, 2));

    if (academics.length > 0 && academics[0].studentName === "Test Student") {
      console.log("VERIFICATION SUCCESS: Data join works correctly.");
    } else {
      console.error("VERIFICATION FAILED: Join result mismatch.");
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error("Test failed:", err);
    process.exit(1);
  }
};

test();
