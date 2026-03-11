import mongoose from 'mongoose';

const academicRecordSchema = new mongoose.Schema({
  regNo: {
    type: String,
    required: true
  },
  // Subject info — stored directly so records display even without a Subject doc
  subject: {
    type: String,
    default: ''
  },
  subjectCode: {
    type: String,
    default: ''
  },
  semester: {
    type: Number,
    default: 1
  },
  // Internal assessment marks
  cycleTest1: { type: Number, default: 0 },
  cycleTest2: { type: Number, default: 0 },
  internal1:  { type: Number, default: 0 },
  internal2:  { type: Number, default: 0 },
  modelExam:  { type: Number, default: 0 },
  // Generic marks field (used when a single marks column is present)
  marks: { type: Number, default: 0 },
  // Attendance
  attendanceHours:   { type: Number, default: 0 },
  attendancePercent: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Prevent duplicates: one record per (student, subject, semester)
academicRecordSchema.index({ regNo: 1, subject: 1, semester: 1 }, { unique: true });

const AcademicRecord = mongoose.model('AcademicRecord', academicRecordSchema);
export default AcademicRecord;
