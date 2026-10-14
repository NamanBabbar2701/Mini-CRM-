import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LeadForm from '../components/LeadForm';
import {
  createLead,
  updateLead,
  fetchLeadById,
  getApiErrorMessage,
} from '../api/leadsApi';
import { LoadingState, ErrorState } from '../components/StateMessage';

export default function LeadFormPage({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = mode === 'edit';
  const [initial, setInitial] = useState(null);
  const [loadingLead, setLoadingLead] = useState(isEdit);
  const [loadError, setLoadError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      setLoadingLead(true);
      setLoadError(null);
      try {
        const res = await fetchLeadById(id);
        setInitial(res.data);
      } catch (err) {
        setLoadError(getApiErrorMessage(err, 'Failed to load lead'));
      } finally {
        setLoadingLead(false);
      }
    })();
  }, [id, isEdit]);

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setFormError(null);
    try {
      if (isEdit) {
        await updateLead(id, payload);
        setSnackbar({ open: true, message: 'Lead updated successfully' });
        setTimeout(() => navigate(`/leads/${id}`), 600);
      } else {
        const res = await createLead(payload);
        setSnackbar({ open: true, message: 'Lead created successfully' });
        setTimeout(() => navigate(`/leads/${res.data._id}`), 600);
      }
    } catch (err) {
      setFormError(getApiErrorMessage(err, 'Failed to save lead'));
    } finally {
      setSubmitting(false);
    }
  };

  if (isEdit && loadingLead) return <LoadingState message="Loading lead…" />;

  if (isEdit && loadError) {
    return (
      <Box>
        <Button startIcon={<ArrowBackIcon />} component={RouterLink} to="/" className="mb-4">
          Back
        </Button>
        <ErrorState message={loadError} />
      </Box>
    );
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        component={RouterLink}
        to={isEdit ? `/leads/${id}` : '/'}
        className="mb-4"
      >
        Back
      </Button>
      <Typography variant="h4" component="h1" className="mb-6 font-bold">
        {isEdit ? 'Edit lead' : 'New lead'}
      </Typography>

      {formError && (
        <Alert severity="error" className="mb-4">
          {formError}
        </Alert>
      )}

      <Paper elevation={0} className="border border-slate-200 p-6 max-w-3xl">
        <LeadForm
          key={initial?._id || 'new'}
          initialValues={initial || undefined}
          onSubmit={handleSubmit}
          submitLabel={isEdit ? 'Update lead' : 'Create lead'}
          loading={submitting}
        />
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: '' })}
        message={snackbar.message}
      />
    </Box>
  );
}
