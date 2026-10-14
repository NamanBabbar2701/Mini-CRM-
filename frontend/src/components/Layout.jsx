import { Link as RouterLink, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import TableRowsIcon from '@mui/icons-material/TableRows';

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <Box className="min-h-screen bg-slate-50">
      <AppBar position="static" elevation={0} color="primary" enableColorOnDark>
        <Toolbar className="gap-4">
          <Typography variant="h6" component="div" className="flex-1 font-semibold">
            Mini CRM
          </Typography>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
            startIcon={<TableRowsIcon />}
            variant={location.pathname === '/' ? 'outlined' : 'text'}
            sx={{ borderColor: 'rgba(255,255,255,0.5)' }}
          >
            Leads
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/kanban"
            startIcon={<ViewKanbanIcon />}
            variant={location.pathname === '/kanban' ? 'outlined' : 'text'}
            sx={{ borderColor: 'rgba(255,255,255,0.5)' }}
          >
            Pipeline
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" className="py-6 md:py-8">
        {children}
      </Container>
    </Box>
  );
}
