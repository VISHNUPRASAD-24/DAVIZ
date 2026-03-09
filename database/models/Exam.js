import mongoose from 'mongoose';

const examSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  hall: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['Internal', 'Semester', 'Practical'],
    default: 'Semester'
  }
}, {
  timestamps: true
});

const Exam = mongoose.model('Exam', examSchema);
export default Exam;
