import Chip from '@mui/material/Chip';
import { STATUS_COLORS, PRIORITY_COLORS } from '../constants/leads';

export function StatusChip({ status }) {
  return <Chip label={status} size="small" color={STATUS_COLORS[status] || 'default'} />;
}

export function PriorityChip({ priority }) {
  return <Chip label={priority} size="small" variant="outlined" color={PRIORITY_COLORS[priority] || 'default'} />;
}
