import { body, param, query, validationResult } from 'express-validator';
import { LEAD_PRIORITIES, LEAD_STATUSES } from '../models/Lead.js';

export const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

const leadBodyRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 200 })
    .withMessage('Name cannot exceed 200 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('company')
    .trim()
    .notEmpty()
    .withMessage('Company is required')
    .isLength({ max: 200 })
    .withMessage('Company cannot exceed 200 characters'),
  body('status')
    .optional()
    .isIn(LEAD_STATUSES)
    .withMessage(`Status must be one of: ${LEAD_STATUSES.join(', ')}`),
  body('priority')
    .optional()
    .isIn(LEAD_PRIORITIES)
    .withMessage(`Priority must be one of: ${LEAD_PRIORITIES.join(', ')}`),
];

export const validateCreateLead = [...leadBodyRules, handleValidation];
export const validateUpdateLead = [
  param('id').isMongoId().withMessage('Invalid lead id'),
  ...leadBodyRules,
  handleValidation,
];

export const validateLeadId = [
  param('id').isMongoId().withMessage('Invalid lead id'),
  handleValidation,
];

export const validatePatchStatus = [
  param('id').isMongoId().withMessage('Invalid lead id'),
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(LEAD_STATUSES)
    .withMessage(`Status must be one of: ${LEAD_STATUSES.join(', ')}`),
  handleValidation,
];

const SORT_FIELDS = ['name', 'createdAt', 'status', 'priority'];

export const validateListLeads = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be at least 1'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('sortBy')
    .optional()
    .isIn(SORT_FIELDS)
    .withMessage(`sortBy must be one of: ${SORT_FIELDS.join(', ')}`),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('sortOrder must be asc or desc'),
  query('status')
    .optional()
    .custom((value) => {
      if (!value) return true;
      const parts = value.split(',').map((s) => s.trim());
      return parts.every((s) => LEAD_STATUSES.includes(s));
    })
    .withMessage('Invalid status filter'),
  query('priority')
    .optional()
    .custom((value) => {
      if (!value) return true;
      const parts = value.split(',').map((s) => s.trim());
      return parts.every((s) => LEAD_PRIORITIES.includes(s));
    })
    .withMessage('Invalid priority filter'),
  handleValidation,
];
