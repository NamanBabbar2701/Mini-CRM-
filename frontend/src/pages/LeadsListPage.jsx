import { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TablePagination from '@mui/material/TablePagination';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchLeads, deleteLead, getApiErrorMessage } from '../api/leadsApi';
import { LEAD_PRIORITIES, LEAD_STATUSES } from '../constants/leads';
import { StatusChip, PriorityChip } from '../components/StatusChip';
import { LoadingState, EmptyState, ErrorState } from '../components/StateMessage';

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString();
}

export default function LeadsListPage() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [searchDebounced, setSearchDebounced] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const t = setTimeout(() => setSearchDebounced(search.trim()), 350);
    return () => clearTimeout(t);
  }, [search]);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchLeads({
        page: page + 1,
        limit: rowsPerPage,
        search: searchDebounced || undefined,
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
        sortBy,
        sortOrder,
      });
      setLeads(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load leads'));
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchDebounced, statusFilter, priorityFilter, sortBy, sortOrder]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  useEffect(() => {
    setPage(0);
  }, [searchDebounced, statusFilter, priorityFilter, sortBy, sortOrder]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteLead(deleteTarget._id);
      setSnackbar({ open: true, message: 'Lead deleted successfully', severity: 'success' });
      setDeleteTarget(null);
      loadLeads();
    } catch (err) {
      setSnackbar({
        open: true,
        message: getApiErrorMessage(err, 'Failed to delete lead'),
        severity: 'error',
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const isEmpty = !loading && !error && leads.length === 0;
  const hasFilters = searchDebounced || statusFilter || priorityFilter;

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
        spacing={2}
        className="mb-6"
      >
        <Typography variant="h4" component="h1" className="font-bold">
          Sales Leads
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/leads/new')}
        >
          Add lead
        </Button>
      </Stack>

      <Paper elevation={0} className="mb-4 border border-slate-200 p-4">
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            label="Search name, email, company"
            size="small"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <TextField
            select
            label="Status"
            size="small"
            fullWidth
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="">All statuses</MenuItem>
            {LEAD_STATUSES.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Priority"
            size="small"
            fullWidth
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="">All priorities</MenuItem>
            {LEAD_PRIORITIES.map((p) => (
              <MenuItem key={p} value={p}>
                {p}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </Paper>

      {error && (
        <Box className="mb-4">
          <ErrorState message={error} onRetry={loadLeads} />
        </Box>
      )}

      {loading && <LoadingState message="Loading leads…" />}

      {isEmpty && (
        <EmptyState
          title={hasFilters ? 'No matching leads' : 'No leads yet'}
          description={
            hasFilters
              ? 'Try adjusting your search or filters.'
              : 'Create your first lead to get started.'
          }
          action={
            !hasFilters && (
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/leads/new')}>
                Add lead
              </Button>
            )
          }
        />
      )}

      {!loading && !error && leads.length > 0 && (
        <Paper elevation={0} className="border border-slate-200 overflow-hidden">
          <TableContainer className="max-w-full overflow-x-auto">
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sortDirection={sortBy === 'name' ? sortOrder : false}>
                    <TableSortLabel
                      active={sortBy === 'name'}
                      direction={sortBy === 'name' ? sortOrder : 'asc'}
                      onClick={() => handleSort('name')}
                    >
                      Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell sortDirection={sortBy === 'status' ? sortOrder : false}>
                    <TableSortLabel
                      active={sortBy === 'status'}
                      direction={sortBy === 'status' ? sortOrder : 'asc'}
                      onClick={() => handleSort('status')}
                    >
                      Status
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sortDirection={sortBy === 'priority' ? sortOrder : false}>
                    <TableSortLabel
                      active={sortBy === 'priority'}
                      direction={sortBy === 'priority' ? sortOrder : 'asc'}
                      onClick={() => handleSort('priority')}
                    >
                      Priority
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sortDirection={sortBy === 'createdAt' ? sortOrder : false}>
                    <TableSortLabel
                      active={sortBy === 'createdAt'}
                      direction={sortBy === 'createdAt' ? sortOrder : 'asc'}
                      onClick={() => handleSort('createdAt')}
                    >
                      Created
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead._id} hover>
                    <TableCell>{lead.name}</TableCell>
                    <TableCell>{lead.email}</TableCell>
                    <TableCell>{lead.company}</TableCell>
                    <TableCell>
                      <StatusChip status={lead.status} />
                    </TableCell>
                    <TableCell>
                      <PriorityChip priority={lead.priority} />
                    </TableCell>
                    <TableCell>{formatDate(lead.createdAt)}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        aria-label="View"
                        component={RouterLink}
                        to={`/leads/${lead._id}`}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        aria-label="Edit"
                        onClick={() => navigate(`/leads/${lead._id}/edit`)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        aria-label="Delete"
                        color="error"
                        onClick={() => setDeleteTarget(lead)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={pagination.total}
            page={page}
            onPageChange={(_e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </Paper>
      )}

      <Dialog open={Boolean(deleteTarget)} onClose={() => !deleteLoading && setDeleteTarget(null)}>
        <DialogTitle>Delete lead?</DialogTitle>
        <DialogContent>
          This will permanently remove {deleteTarget?.name}. This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button color="error" variant="contained" onClick={confirmDelete} disabled={deleteLoading}>
            {deleteLoading ? 'Deleting…' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
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
