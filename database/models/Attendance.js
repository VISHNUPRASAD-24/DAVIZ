import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  roll: {
    type: String,
    required: true,
    ref: 'Student'
  },
  subject: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    required: true,
    enum: ['Present', 'Absent'],
    default: 'Present'
  }
}, {
  timestamps: true
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;
