import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import { fetchLeadById, getApiErrorMessage } from '../api/leadsApi';
import { StatusChip, PriorityChip } from '../components/StatusChip';
import { LoadingState, ErrorState } from '../components/StateMessage';

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString();
}

export default function LeadDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchLeadById(id);
      setLead(res.data);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load lead'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  if (loading) return <LoadingState message="Loading lead details…" />;

  if (error) {
    return (
      <Box>
        <Button startIcon={<ArrowBackIcon />} component={RouterLink} to="/" className="mb-4">
          Back to leads
        </Button>
        <ErrorState message={error} onRetry={load} />
      </Box>
    );
  }

  if (!lead) return null;

  return (
    <Box>
      <Stack direction="row" spacing={2} alignItems="center" className="mb-6">
        <Button startIcon={<ArrowBackIcon />} component={RouterLink} to="/">
          Back
        </Button>
        <Typography variant="h4" component="h1" className="flex-1 font-bold">
          {lead.name}
        </Typography>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/leads/${id}/edit`)}
        >
          Edit
        </Button>
      </Stack>

      <Paper elevation={0} className="border border-slate-200 p-6 max-w-2xl">
        <Stack spacing={3}>
          <Box>
            <Typography variant="overline" color="text.secondary">
              Contact
            </Typography>
            <Typography variant="body1">{lead.email}</Typography>
          </Box>
          <Divider />
          <Box>
            <Typography variant="overline" color="text.secondary">
              Company
            </Typography>
            <Typography variant="body1">{lead.company}</Typography>
          </Box>
          <Divider />
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Box>
              <Typography variant="overline" color="text.secondary" display="block">
                Status
              </Typography>
              <StatusChip status={lead.status} />
            </Box>
            <Box>
              <Typography variant="overline" color="text.secondary" display="block">
                Priority
              </Typography>
              <PriorityChip priority={lead.priority} />
            </Box>
          </Stack>
          <Divider />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4}>
            <Box>
              <Typography variant="overline" color="text.secondary">
                Created
              </Typography>
              <Typography variant="body2">{formatDate(lead.createdAt)}</Typography>
            </Box>
            <Box>
              <Typography variant="overline" color="text.secondary">
                Last updated
              </Typography>
              <Typography variant="body2">{formatDate(lead.updatedAt)}</Typography>
            </Box>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
