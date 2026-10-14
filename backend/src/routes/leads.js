import express from 'express';
import Lead from '../models/Lead.js';
import {
  validateCreateLead,
  validateUpdateLead,
  validateLeadId,
  validateListLeads,
  validatePatchStatus,
} from '../middleware/validateLead.js';

const router = express.Router();

router.get('/', validateListLeads, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const search = (req.query.search || '').trim();

    const filter = {};

    if (search) {
      const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [{ name: regex }, { email: regex }, { company: regex }];
    }

    if (req.query.status) {
      const statuses = req.query.status.split(',').map((s) => s.trim());
      filter.status = { $in: statuses };
    }

    if (req.query.priority) {
      const priorities = req.query.priority.split(',').map((s) => s.trim());
      filter.priority = { $in: priorities };
    }

    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      Lead.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: leads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.get('/all', async (req, res, next) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: leads });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', validateLeadId, async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id).lean();
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    res.json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
});

router.post('/', validateCreateLead, async (req, res, next) => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json({ success: true, data: lead, message: 'Lead created successfully' });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', validateUpdateLead, async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    res.json({ success: true, data: lead, message: 'Lead updated successfully' });
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/status', validatePatchStatus, async (req, res, next) => {
  try {
    const { status } = req.body;
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    res.json({ success: true, data: lead, message: 'Status updated' });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
    next(err);
  }
});

router.delete('/:id', validateLeadId, async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    res.json({ success: true, message: 'Lead deleted successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
