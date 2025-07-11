import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Fade,
} from '@mui/material';
import SignIn from '../components/SignIn';
import SignUp from '../components/SignUp';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../utils/firebase';

const GREEN = '#219a6f';

export default function LoginPage() {
  const [mode, setMode] = useState('login');
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = () => {
    setResetDialogOpen(true);
    setResetSent(false);
    setError('');
    setResetEmail('');
  };

  const handlePasswordReset = async () => {
    setLoading(true);
    setError('');
    setResetSent(false);
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
      }}
    >
      <Fade in timeout={600}>
        <Paper
          elevation={8}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 400,
            borderRadius: 4,
            boxShadow: 8,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <img
              src='/pwa-192x192.png'
              alt='Spending Tracker'
              style={{ width: 64, height: 64, borderRadius: '50%' }}
            />
          </Box>
          <Typography variant='h5' align='center' gutterBottom fontWeight={700}>
            {mode === 'login' ? 'Welcome Back!' : 'Create Account'}
          </Typography>
          {mode === 'login' ? (
            <SignIn
              onSwitchMode={() => setMode('signup')}
              onForgotPassword={handleForgotPassword}
            />
          ) : (
            <SignUp onSwitchMode={() => setMode('login')} />
          )}
        </Paper>
      </Fade>
      <Dialog
        open={resetDialogOpen}
        onClose={() => {
          setResetDialogOpen(false);
          setResetSent(false);
          setError('');
        }}
      >
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <TextField
            label='Email'
            type='email'
            fullWidth
            margin='normal'
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            required
          />
          {resetSent && (
            <Alert severity='success'>Password reset email sent!</Alert>
          )}
          {error && (
            <Alert severity='error' sx={{ mt: 1 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setResetDialogOpen(false);
              setResetSent(false);
              setError('');
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePasswordReset}
            disabled={loading || !resetEmail}
            variant='contained'
            color='success'
          >
            {loading ? <span>Sending...</span> : 'Send Reset Email'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
