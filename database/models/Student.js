import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  roll: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    sparse: true
  },
  phone: {
    type: String,
    unique: true,
    sparse: true
  },
  department: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  semester: {
    type: Number,
    required: true,
    default: 1
  },
  gender: String,
  dob: Date
}, {
  timestamps: true
});

const Student = mongoose.model('Student', studentSchema);

export default Student;
