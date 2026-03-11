import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  regNo: {
    type: String,
    required: true,
    ref: 'Student'
  },
  studentName: {
    type: String
  },
  subject: {
    type: String,
    required: true
  },
  hoursConducted: {
    type: Number,
    default: 0
  },
  hoursPresent: {
    type: Number,
    default: 0
  },
  percentage: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;
