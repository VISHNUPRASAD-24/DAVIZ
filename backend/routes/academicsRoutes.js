import express from 'express';
import Marks from '../../database/models/Marks.js';
import Student from '../../database/models/Student.js';
import Subject from '../../database/models/Subject.js';

const router = express.Router();

// Get all academic records with student and subject details
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;

    const records = await Marks.aggregate([
      {
        $lookup: {
          from: 'students',
          localField: 'regNo',
          foreignField: 'regNo',
          as: 'student'
        }
      },
      {
        $lookup: {
          from: 'subjects',
          localField: 'subject', // marks uses subject string mostly
          foreignField: 'subjectCode',
          as: 'subjectRef'
        }
      },
      // Use preserveNullAndEmptyArrays so records without a linked student/subject still show
      { $unwind: { path: '$student', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$subjectRef', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          regNo: 1,
          studentName: { $ifNull: ['$student.name', '$studentName'] },
          subject: 1,
          subjectCode: { $ifNull: ['$subjectRef.subjectCode', '$subject'] },
          subjectName: { $ifNull: ['$subjectRef.subjectName', '$subject'] },
          semester: '$sem',
          // Detailed internal assessment marks
          cycleTest1: '$cycle1',
          cycleTest2: '$cycle2',
          internal1:  1,
          internal2:  1,
          modelExam:  '$model',
          marks: '$total', // Use total for the UI
          total: 1
        }
      },
      // Optional search filter
      ...(search ? [{
        $match: {
          $or: [
            { regNo: { $regex: search, $options: 'i' } },
            { studentName: { $regex: search, $options: 'i' } },
            { subjectCode: { $regex: search, $options: 'i' } },
            { subjectName: { $regex: search, $options: 'i' } },
            { subject: { $regex: search, $options: 'i' } }
          ]
        }
      }] : []),
      { $sort: { regNo: 1, subject: 1 } }
    ]);

    console.log(`[GET /api/academics] Returning ${records.length} records`);
    res.json({ success: true, data: records });
  } catch (err) {
    console.error("API ERROR (GET /api/academics):", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get records for a specific student
router.get('/:regNo', async (req, res) => {
  try {
    const records = await Marks.find({ regNo: req.params.regNo });
    res.json({ success: true, data: records });
  } catch (err) {
    console.error("API ERROR (GET /api/academics/:regNo):", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Delete a record
router.delete('/:id', async (req, res) => {
  try {
    const result = await Marks.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ success: false, message: 'Record not found' });
    res.json({ success: true, message: 'Record deleted' });
  } catch (err) {
    console.error("API ERROR (DELETE /api/academics/:id):", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
