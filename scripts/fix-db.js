import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const fixDatabase = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/daviz");
    console.log("Connected to MongoDB...");

    const db = mongoose.connection.db;
    const studentsCollection = db.collection('students');

    console.log("Dropping all existing indexes on students collection...");
    await studentsCollection.dropIndexes();
    console.log("Indexes dropped successfully.");

    console.log("Creating unique index on 'roll' field...");
    await studentsCollection.createIndex({ roll: 1 }, { unique: true });
    console.log("Unique index on 'roll' created successfully.");

    // Also check other collections for legacy indexes if any
    const attendanceCollection = db.collection('attendances');
    try {
      await attendanceCollection.dropIndex('rollNumber_1');
      console.log("Dropped rollNumber index from attendances.");
    } catch (e) {}

    const marksCollection = db.collection('marks');
    try {
      await marksCollection.dropIndex('rollNumber_1');
      console.log("Dropped rollNumber index from marks.");
    } catch (e) {}

    console.log("Database fix complete.");
    process.exit(0);
  } catch (err) {
    console.error("Error fixing database:", err);
    process.exit(1);
  }
};

fixDatabase();
