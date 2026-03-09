import express from 'express';
import Fee from '../../database/models/Fee.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const fees = await Fee.find().populate('studentRoll');
    res.json(Array.isArray(fees) ? fees : []);
  } catch (error) {
    console.error("API ERROR (GET fees):", error);
    res.status(500).json([]);
  }
});

router.post('/', async (req, res) => {
  try {
    const fee = new Fee(req.body);
    const newFee = await fee.save();
    res.status(201).json({ success: true, fee: newFee });
  } catch (error) {
    console.error("API ERROR (POST fee):", error);
    res.status(400).json({ success: false, message: error.message });
  }
});

router.post('/bulk', async (req, res) => {
  try {
    const result = await Fee.insertMany(req.body, { ordered: false });
    res.status(201).json({ success: true, count: result.length });
  } catch (error) {
    console.error("API ERROR (POST bulk fees):", error);
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
