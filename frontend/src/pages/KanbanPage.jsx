import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { LEAD_STATUSES } from '../constants/leads';
import { StatusChip, PriorityChip } from '../components/StatusChip';
import { fetchAllLeads, patchLeadStatus, getApiErrorMessage } from '../api/leadsApi';
import { LoadingState, EmptyState, ErrorState } from '../components/StateMessage';

export default function KanbanPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [movingId, setMovingId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchAllLeads();
      setLeads(res.data);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load pipeline'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const byStatus = useMemo(() => {
    const map = Object.fromEntries(LEAD_STATUSES.map((s) => [s, []]));
    for (const lead of leads) {
      if (map[lead.status]) map[lead.status].push(lead);
      else map.New.push(lead);
    }
    return map;
  }, [leads]);

  const handleStatusChange = async (leadId, newStatus) => {
    const lead = leads.find((l) => l._id === leadId);
    if (!lead || lead.status === newStatus) return;
    setMovingId(leadId);
    const prev = leads;
    setLeads((list) =>
      list.map((l) => (l._id === leadId ? { ...l, status: newStatus } : l))
    );
    try {
      await patchLeadStatus(leadId, newStatus);
      setSnackbar({ open: true, message: 'Lead moved', severity: 'success' });
    } catch (err) {
      setLeads(prev);
      setSnackbar({
        open: true,
        message: getApiErrorMessage(err, 'Failed to update status'),
        severity: 'error',
      });
    } finally {
      setMovingId(null);
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" className="mb-2 font-bold">
        Sales pipeline
      </Typography>
      <Typography color="text.secondary" className="mb-6">
        Kanban view grouped by status. Change status from each card to move leads through the pipeline.
      </Typography>

      {error && (
        <Box className="mb-4">
          <ErrorState message={error} onRetry={load} />
        </Box>
      )}

      {loading && <LoadingState message="Loading pipeline…" />}

      {!loading && !error && leads.length === 0 && (
        <EmptyState
          title="Pipeline is empty"
          description="Add leads from the Leads table to see them here."
        />
      )}

      {!loading && !error && leads.length > 0 && (
        <Box
          className="flex gap-4 overflow-x-auto pb-4"
          sx={{ alignItems: 'flex-start' }}
        >
          {LEAD_STATUSES.map((status) => (
            <Paper
              key={status}
              elevation={0}
              className="min-w-[260px] max-w-[280px] shrink-0 border border-slate-200 bg-slate-100/80"
            >
              <Box className="sticky top-0 z-10 border-b border-slate-200 bg-slate-100/95 px-3 py-3">
                <StackRow status={status} count={byStatus[status].length} />
              </Box>
              <Box className="flex flex-col gap-2 p-2 min-h-[120px]">
                {byStatus[status].map((lead) => (
                  <Card key={lead._id} variant="outlined" className="bg-white">
                    <CardActionArea component={RouterLink} to={`/leads/${lead._id}`}>
                      <CardContent className="!p-3">
                        <Typography variant="subtitle2" className="font-semibold">
                          {lead.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {lead.company}
                        </Typography>
                        <Box className="mt-2">
                          <PriorityChip priority={lead.priority} />
                        </Box>
                      </CardContent>
                    </CardActionArea>
                    <Box className="px-2 pb-2">
                      <TextField
                        select
                        size="small"
                        fullWidth
                        label="Move to"
                        value={lead.status}
                        disabled={movingId === lead._id}
                        onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {LEAD_STATUSES.map((s) => (
                          <MenuItem key={s} value={s}>
                            {s}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Box>
                  </Card>
                ))}
              </Box>
            </Paper>
          ))}
        </Box>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

function StackRow({ status, count }) {
  return (
    <Box className="flex items-center justify-between gap-2">
      <StatusChip status={status} />
      <Typography variant="caption" color="text.secondary">
        {count}
      </Typography>
    </Box>
  );
}
