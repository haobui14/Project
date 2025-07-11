import React, { useState } from 'react';
import { Box, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { auth } from '../utils/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const GREEN = '#219a6f';

export default function SignUp({ onSwitchMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box component='form' onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          label='Email'
          type='email'
          fullWidth
          margin='normal'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete='email'
        />
        <TextField
          label='Password'
          type='password'
          fullWidth
          margin='normal'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete='new-password'
        />
        <Button
          type='submit'
          variant='contained'
          color='success'
          fullWidth
          sx={{
            mt: 2,
            py: 1.2,
            fontWeight: 600,
            fontSize: 16,
            letterSpacing: 1,
          }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color='inherit' /> : 'Sign Up'}
        </Button>
      </Box>
      <Button
        onClick={onSwitchMode}
        size='small'
        sx={{ textTransform: 'none', color: GREEN, fontWeight: 600, mt: 2 }}
      >
        Already have an account? Login
      </Button>
      {error && (
        <Alert severity='error' sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
}
