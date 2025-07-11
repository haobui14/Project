import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
} from 'react-router-dom';
import LoginPage from './routes/LoginPage';
import Dashboard from './routes/Dashboard';
import CalendarView from './routes/CalendarView';
import SharedDashboard from './routes/SharedDashboard';
import { auth } from './utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import NavBar from './components/NavBar';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useMemo, useState } from 'react';

function DashboardWithParams() {
  const { year, month } = useParams();
  return <Dashboard year={parseInt(year)} month={parseInt(month)} />;
}

export default function App() {
  const [user, loading] = useAuthState(auth);
  const [mode, setMode] = useState('light');
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: '#1976d2' },
          ...(mode === 'dark' && {
            background: { default: '#181c1f', paper: '#23272b' },
          }),
        },
        shape: { borderRadius: 8 },
        typography: { fontFamily: 'Inter, Roboto, Arial, sans-serif' },
      }),
    [mode]
  );
  const toggleMode = () =>
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));

  if (loading) return null;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {user && <NavBar mode={mode} toggleMode={toggleMode} />}
        <Routes>
          <Route
            path='/'
            element={
              user ? <Navigate to='/dashboard' /> : <Navigate to='/login' />
            }
          />
          <Route
            path='/login'
            element={user ? <Navigate to='/dashboard' /> : <LoginPage />}
          />
          <Route
            path='/dashboard'
            element={user ? <Dashboard /> : <Navigate to='/login' />}
          />
          <Route
            path='/dashboard/:year/:month'
            element={user ? <DashboardWithParams /> : <Navigate to='/login' />}
          />
          <Route
            path='/calendar'
            element={user ? <CalendarView /> : <Navigate to='/login' />}
          />
          <Route path='/shared/:shareId' element={<SharedDashboard />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
