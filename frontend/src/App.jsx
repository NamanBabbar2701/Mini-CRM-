import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Layout from './components/Layout';
import LeadsListPage from './pages/LeadsListPage';
import LeadDetailPage from './pages/LeadDetailPage';
import LeadFormPage from './pages/LeadFormPage';
import KanbanPage from './pages/KanbanPage';

const theme = createTheme({
  palette: {
    primary: { main: '#2563eb' },
    background: { default: '#f8fafc' },
  },
  typography: {
    fontFamily: '"Inter", system-ui, sans-serif',
  },
  shape: { borderRadius: 10 },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <Routes>
          <Route path="/" element={<LeadsListPage />} />
          <Route path="/kanban" element={<KanbanPage />} />
          <Route path="/leads/new" element={<LeadFormPage mode="create" />} />
          <Route path="/leads/:id" element={<LeadDetailPage />} />
          <Route path="/leads/:id/edit" element={<LeadFormPage mode="edit" />} />
        </Routes>
      </Layout>
    </ThemeProvider>
  );
}
