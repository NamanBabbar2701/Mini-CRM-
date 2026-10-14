import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';

export function LoadingState({ message = 'Loading…' }) {
  return (
    <Box className="flex flex-col items-center justify-center gap-3 py-16">
      <CircularProgress />
      <Typography color="text.secondary">{message}</Typography>
    </Box>
  );
}

export function EmptyState({ title = 'No leads yet', description, action }) {
  return (
    <Box className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      <InboxOutlinedIcon sx={{ fontSize: 56 }} color="disabled" />
      <Typography variant="h6">{title}</Typography>
      {description && (
        <Typography color="text.secondary" className="max-w-md">
          {description}
        </Typography>
      )}
      {action}
    </Box>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <Alert
      severity="error"
      action={
        onRetry ? (
          <button type="button" onClick={onRetry} className="underline text-inherit">
            Retry
          </button>
        ) : null
      }
    >
      {message}
    </Alert>
  );
}
