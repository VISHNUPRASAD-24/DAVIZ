import mongoose from 'mongoose';

const timetableSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  },
  subject: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  faculty: {
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
  }
}, {
  timestamps: true
});

const Timetable = mongoose.model('Timetable', timetableSchema);
export default Timetable;
