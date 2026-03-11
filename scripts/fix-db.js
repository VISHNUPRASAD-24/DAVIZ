import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const fixDatabase = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/daviz");
    console.log("Connected to MongoDB...");

    const db = mongoose.connection.db;
    const studentsCollection = db.collection('students');

    console.log("Dropping existing indexes on students collection except _id...");
    try {
      // get indexes and drop anything matching 'roll'
      await studentsCollection.dropIndex('roll_1');
      console.log("Dropped roll_1 index from students.");
    } catch(e) {
      console.log("roll_1 index not found entirely or already dropped.");
    }
    
    // Also check other collections for legacy indexes if any
    const attendanceCollection = db.collection('attendances');
    try {
      await attendanceCollection.dropIndex('rollNumber_1');
      console.log("Dropped rollNumber index from attendances.");
    } catch (e) {}

    const marksCollection = db.collection('marks');
    try {
      await marksCollection.dropIndex('roll_1_semester_1_subject_1');
      console.log("Dropped roll_1_semester_1_subject_1 index from marks.");
    } catch (e) {
      console.log("Legacy roll marks index not found entirely or already dropped.");
    }

    try {
      await marksCollection.dropIndex('regNo_1_subject_1');
      console.log("Dropped regNo_1_subject_1 index from marks.");
    } catch (e) {
      console.log("Legacy regNo marks index not found entirely or already dropped.");
    }

    console.log("Database fix complete.");
    process.exit(0);
  } catch (err) {
    console.error("Error fixing database:", err);
    process.exit(1);
  }
};

fixDatabase();
