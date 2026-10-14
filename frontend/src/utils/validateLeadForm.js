import { LEAD_PRIORITIES, LEAD_STATUSES } from '../constants/leads';

const EMAIL_RE = /^\S+@\S+\.\S+$/;

export function validateLeadForm(values) {
  const errors = {};

  const name = (values.name || '').trim();
  if (!name) errors.name = 'Name is required';
  else if (name.length > 200) errors.name = 'Name cannot exceed 200 characters';

  const email = (values.email || '').trim();
  if (!email) errors.email = 'Email is required';
  else if (!EMAIL_RE.test(email)) errors.email = 'Please enter a valid email address';

  const company = (values.company || '').trim();
  if (!company) errors.company = 'Company is required';
  else if (company.length > 200) errors.company = 'Company cannot exceed 200 characters';

  if (values.status && !LEAD_STATUSES.includes(values.status)) {
    errors.status = 'Invalid status';
  }

  if (values.priority && !LEAD_PRIORITIES.includes(values.priority)) {
    errors.priority = 'Invalid priority';
  }

  return errors;
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}
