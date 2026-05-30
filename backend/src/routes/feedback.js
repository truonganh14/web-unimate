import { Router } from 'express';
import { Feedback } from '../models/Feedback.js';
import { adminAuth } from '../middleware/adminAuth.js';
import { jwtAuth } from '../middleware/jwtAuth.js';
import { validateFeedback } from '../middleware/validateFeedback.js';

const router = Router();

router.post('/', jwtAuth, validateFeedback, async (req, res) => {
  try {
    const feedback = await Feedback.create({
      ...req.validatedFeedback,
      userId: req.user._id,
    });

    return res.status(201).json({
      message: 'Feedback submitted successfully',
      data: {
        id: feedback._id,
        name: feedback.name,
        email: feedback.email,
        phone: feedback.phone,
        subject: feedback.subject,
        message: feedback.message,
        rating: feedback.rating,
        createdAt: feedback.createdAt,
      },
    });
  } catch (error) {
    console.error('Create feedback error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/public', async (req, res) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(12, Math.max(1, Number.parseInt(req.query.limit, 10) || 3));
    const skip = (page - 1) * limit;

    const [feedbacks, total] = await Promise.all([
      Feedback.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('name subject message rating createdAt'),
      Feedback.countDocuments(),
    ]);

    return res.status(200).json({
      message: 'Public feedbacks fetched successfully',
      data: feedbacks.map((feedback) => ({
        id: feedback._id,
        name: feedback.name,
        subject: feedback.subject,
        message: feedback.message,
        rating: feedback.rating,
        createdAt: feedback.createdAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (error) {
    console.error('Public feedback list error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/', adminAuth, async (_req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .sort({ createdAt: -1 })
      .select('name email phone subject message rating createdAt');

    return res.status(200).json({
      message: 'Feedbacks fetched successfully',
      data: feedbacks.map((feedback) => ({
        id: feedback._id,
        name: feedback.name,
        email: feedback.email,
        phone: feedback.phone,
        subject: feedback.subject,
        message: feedback.message,
        rating: feedback.rating,
        createdAt: feedback.createdAt,
      })),
    });
  } catch (error) {
    console.error('List feedback error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    return res.status(200).json({
      message: 'Feedback deleted successfully',
      data: { id: feedback._id },
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid feedback id' });
    }

    console.error('Delete feedback error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
