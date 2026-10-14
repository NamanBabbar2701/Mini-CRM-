import mongoose from 'mongoose';

export const LEAD_STATUSES = [
  'New',
  'Contacted',
  'Qualified',
  'Proposal',
  'Won',
  'Lost',
];

export const LEAD_PRIORITIES = ['Low', 'Medium', 'High'];

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^\S+@\S+\.\S+$/,
        'Please provide a valid email address',
      ],
    },
    company: {
      type: String,
      required: [true, 'Company is required'],
      trim: true,
      maxlength: [200, 'Company cannot exceed 200 characters'],
    },
    status: {
      type: String,
      enum: {
        values: LEAD_STATUSES,
        message: '{VALUE} is not a valid status',
      },
      default: 'New',
    },
    priority: {
      type: String,
      enum: {
        values: LEAD_PRIORITIES,
        message: '{VALUE} is not a valid priority',
      },
      default: 'Medium',
    },
  },
  {
    timestamps: true,
  }
);

leadSchema.index({ name: 'text', email: 'text', company: 'text' });

export default mongoose.model('Lead', leadSchema);
