import express from 'express';
import Notice from '../../database/models/Notice.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json(Array.isArray(notices) ? notices : []);
  } catch (error) {
    console.error("API ERROR (GET notices):", error);
    res.status(500).json([]);
  }
});

router.post('/', async (req, res) => {
  try {
    const notice = new Notice(req.body);
    const newNotice = await notice.save();
    res.status(201).json({ success: true, notice: newNotice });
  } catch (error) {
    console.error("API ERROR (POST notice):", error);
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
