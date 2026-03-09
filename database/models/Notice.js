import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Academic', 'Exam', 'Event', 'General'],
    default: 'General'
  },
  postedBy: {
    type: String,
    required: true
  },
  targetDepartment: [String],
  targetYear: [Number],
  expiryDate: Date
}, {
  timestamps: true
});

const Notice = mongoose.model('Notice', noticeSchema);
export default Notice;
