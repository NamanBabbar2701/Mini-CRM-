import { useState } from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid2';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { LEAD_PRIORITIES, LEAD_STATUSES } from '../constants/leads';
import { validateLeadForm, hasErrors } from '../utils/validateLeadForm';

const defaultValues = {
  name: '',
  email: '',
  company: '',
  status: 'New',
  priority: 'Medium',
};

export default function LeadForm({ initialValues, onSubmit, submitLabel = 'Save', loading = false }) {
  const [values, setValues] = useState({ ...defaultValues, ...initialValues });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (field) => (e) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
    if (touched[field]) {
      setErrors((prev) => {
        const next = validateLeadForm({ ...values, [field]: e.target.value });
        const copy = { ...prev };
        if (next[field]) copy[field] = next[field];
        else delete copy[field];
        return copy;
      });
    }
  };

  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const next = validateLeadForm(values);
    setErrors((prev) => {
      const copy = { ...prev };
      if (next[field]) copy[field] = next[field];
      else delete copy[field];
      return copy;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = validateLeadForm(values);
    setErrors(nextErrors);
    setTouched({ name: true, email: true, company: true, status: true, priority: true });
    if (hasErrors(nextErrors)) return;
    onSubmit({
      name: values.name.trim(),
      email: values.email.trim(),
      company: values.company.trim(),
      status: values.status,
      priority: values.priority,
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Name"
            fullWidth
            required
            value={values.name}
            onChange={handleChange('name')}
            onBlur={handleBlur('name')}
            error={Boolean(touched.name && errors.name)}
            helperText={touched.name && errors.name}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            value={values.email}
            onChange={handleChange('email')}
            onBlur={handleBlur('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Company"
            fullWidth
            required
            value={values.company}
            onChange={handleChange('company')}
            onBlur={handleBlur('company')}
            error={Boolean(touched.company && errors.company)}
            helperText={touched.company && errors.company}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            select
            label="Status"
            fullWidth
            value={values.status}
            onChange={handleChange('status')}
          >
            {LEAD_STATUSES.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            select
            label="Priority"
            fullWidth
            value={values.priority}
            onChange={handleChange('priority')}
          >
            {LEAD_PRIORITIES.map((p) => (
              <MenuItem key={p} value={p}>
                {p}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
      <Stack direction="row" spacing={2} className="mt-6">
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? 'Saving…' : submitLabel}
        </Button>
      </Stack>
    </form>
  );
}
