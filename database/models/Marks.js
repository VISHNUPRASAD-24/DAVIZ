import mongoose from 'mongoose';

const marksSchema = new mongoose.Schema({
  regNo: { type: String, required: true },
  studentName: String,
  subject: String,
  sem: Number,
  cycle1: Number,
  cycle2: Number,
  internal1: Number,
  internal2: Number,
  model: Number,
  total: Number
}, {
  timestamps: true
});

// Unique index for student + sem + subject
marksSchema.index({ regNo: 1, sem: 1, subject: 1 }, { unique: true });

const Marks = mongoose.model('Marks', marksSchema);
export default Marks;
