import express from 'express';
import Exam from '../../database/models/Exam.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const exams = await Exam.find();
    res.json(Array.isArray(exams) ? exams : []);
  } catch (error) {
    console.error("API ERROR (GET exams):", error);
    res.status(500).json([]);
  }
});

router.post('/', async (req, res) => {
  try {
    const exam = new Exam(req.body);
    const newExam = await exam.save();
    res.status(201).json({ success: true, exam: newExam });
  } catch (error) {
    console.error("API ERROR (POST exam):", error);
    res.status(400).json({ success: false, message: error.message });
  }
});

router.post('/bulk', async (req, res) => {
  try {
    const result = await Exam.insertMany(req.body, { ordered: false });
    res.status(201).json({ success: true, count: result.length });
  } catch (error) {
    console.error("API ERROR (POST bulk exams):", error);
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
