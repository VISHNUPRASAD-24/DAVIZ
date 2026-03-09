import mongoose from 'mongoose';

const feeSchema = new mongoose.Schema({
  studentRoll: {
    type: String,
    required: true,
    ref: 'Student'
  },
  totalFee: {
    type: Number,
    required: true
  },
  paidAmount: {
    type: Number,
    required: true,
    default: 0
  },
  pendingAmount: {
    type: Number,
    required: true,
    default: function() {
      return this.totalFee - this.paidAmount;
    }
  },
  type: {
    type: String,
    required: true,
    enum: ['Tuition', 'Exam', 'Library', 'Hostel', 'Other']
  },
  status: {
    type: String,
    required: true,
    enum: ['Paid', 'Pending', 'Partial'],
    default: 'Pending'
  },
  dueDate: Date,
  paidDate: Date,
  transactionId: String
}, {
  timestamps: true
});

const Fee = mongoose.model('Fee', feeSchema);
export default Fee;
