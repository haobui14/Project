import React from 'react';
import { Box, Typography, Paper, useMediaQuery } from '@mui/material';
import MonthlySpending from '../components/MonthlySpending';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';

export default function Dashboard({ year: propYear, month: propMonth }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const now = new Date();
  const [year] = useState(propYear || now.getFullYear());
  const [month] = useState(propMonth || now.getMonth() + 1);

  return (
    <Box
      sx={{
        minHeight: '92vh',
        width: '100vw',
        background: theme.palette.background.default,
        m: 0,
        pb: 1,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: '100vw',
          minHeight: '92vh',
          mx: 0,
          my: 0,
          borderRadius: 0,
          py: isMobile ? 2 : 8,
          background: theme.palette.background.paper,
        }}
      >
        <Typography variant='h4' fontWeight={700} align='center' gutterBottom>
          Dashboard
        </Typography>
        <Typography align='center' color='text.secondary' gutterBottom>
          Welcome! Here you will see your monthly spendings and manage your
          finances.
        </Typography>
        <Box sx={{ width: '100%', maxWidth: 700, mt: 2, mx: 'auto' }}>
          <MonthlySpending year={year} month={month} />
        </Box>
      </Paper>
    </Box>
  );
}
