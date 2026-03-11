import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  regNo: {
    type: String,
    required: true,
    unique: true
  },
  roll: { // Keep roll as alias for legacy support if needed, but primary is regNo
    type: String
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
  section: {
    type: String,
    default: 'A'
  },
  gender: String,
  dob: String, // Storing as string to match Excel format easily, or can be Date
  community: String
}, {
  timestamps: true
});

const Student = mongoose.model('Student', studentSchema);

export default Student;
