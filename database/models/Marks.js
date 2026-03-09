import mongoose from 'mongoose';

const marksSchema = new mongoose.Schema({
  roll: {
    type: String,
    required: true,
    ref: 'Student'
  },
  semester: {
    type: Number,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  cycleTest1: {
    type: Number,
    default: 0
  },
  cycleTest2: {
    type: Number,
    default: 0
  },
  internal1: {
    type: Number,
    default: 0
  },
  internal2: {
    type: Number,
    default: 0
  },
  modelExam: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Unique index for student + semester + subject
marksSchema.index({ roll: 1, semester: 1, subject: 1 }, { unique: true });

const Marks = mongoose.model('Marks', marksSchema);
export default Marks;
