import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  useMediaQuery,
  CircularProgress,
  Alert,
  Chip,
  Stack,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { fetchSharedDashboard } from '../utils/firebase';

export default function SharedDashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { shareId } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sharedData, setSharedData] = useState(null);

  useEffect(() => {
    const loadSharedData = async () => {
      try {
        setLoading(true);
        const data = await fetchSharedDashboard(shareId);
        if (!data) {
          setError('This shared link is invalid or has expired.');
          return;
        }
        setSharedData(data);
      } catch (err) {
        setError('Failed to load shared dashboard.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (shareId) {
      loadSharedData();
    }
  }, [shareId]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Alert severity='error' sx={{ maxWidth: 400 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!sharedData) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Alert severity='warning' sx={{ maxWidth: 400 }}>
          No data found for this shared link.
        </Alert>
      </Box>
    );
  }

  const { data, year, month } = sharedData;
  const spendings = data?.items || [];
  // Determine if any item is partially paid
  const hasPartialPaid = spendings.some(
    (item) => item.amountPaid > 0 && !item.paid
  );
  const monthPaidStatus = hasPartialPaid ? 'partial' : data?.status || 'unpaid';
  const total = spendings.reduce((sum, s) => sum + (s.amount || 0), 0);
  const paid = spendings.reduce((sum, s) => sum + (s.amountPaid || 0), 0);
  const unpaid = total - paid;

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'partial':
        return 'warning';
      default:
        return 'error';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'paid':
        return 'Fully Paid';
      case 'partial':
        return 'Partially Paid';
      default:
        return 'Unpaid';
    }
  };

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
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
          minHeight: '100vh',
          mx: 0,
          my: 0,
          borderRadius: 0,
          py: isMobile ? 1 : 8,
          background: theme.palette.background.paper,
        }}
      >
        <Typography variant='h4' fontWeight={700} align='center' gutterBottom>
          Shared Dashboard
        </Typography>
        <Typography
          align='center'
          color='text.secondary'
          gutterBottom
          sx={{ fontSize: isMobile ? '1rem' : '1.2rem', mb: isMobile ? 1 : 2 }}
        >
          {monthNames[month - 1]} {year} Spending Overview
        </Typography>

        <Box
          sx={{
            width: '100%',
            maxWidth: 700,
            mt: isMobile ? 2 : 4,
            mx: 'auto',
            px: isMobile ? 1 : 0,
          }}
        >
          {/* Summary Cards */}
          <Stack
            direction='column'
            spacing={isMobile ? 1.5 : 2}
            sx={{ mb: isMobile ? 2 : 4 }}
          >
            <Paper
              elevation={2}
              sx={{
                p: isMobile ? 2 : 3,
                textAlign: 'center',
                background: theme.palette.primary.main,
                color: 'white',
              }}
            >
              <Typography variant={isMobile ? 'body1' : 'h6'} gutterBottom>
                Total Spending
              </Typography>
              <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight='bold'>
                ${total.toFixed(2)}
              </Typography>
            </Paper>
            <Paper
              elevation={2}
              sx={{
                p: isMobile ? 2 : 3,
                textAlign: 'center',
                background: theme.palette.success.main,
                color: 'white',
              }}
            >
              <Typography variant={isMobile ? 'body1' : 'h6'} gutterBottom>
                Amount Paid
              </Typography>
              <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight='bold'>
                ${paid.toFixed(2)}
              </Typography>
            </Paper>
            <Paper
              elevation={2}
              sx={{
                p: isMobile ? 2 : 3,
                textAlign: 'center',
                background: theme.palette.error.main,
                color: 'white',
              }}
            >
              <Typography variant={isMobile ? 'body1' : 'h6'} gutterBottom>
                Amount Due
              </Typography>
              <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight='bold'>
                ${unpaid.toFixed(2)}
              </Typography>
            </Paper>
          </Stack>

          {/* Status */}
          <Box sx={{ mb: isMobile ? 2 : 3, textAlign: 'center' }}>
            <Chip
              label={getStatusText(monthPaidStatus)}
              color={getStatusColor(monthPaidStatus)}
              size={isMobile ? 'medium' : 'large'}
              sx={{
                fontSize: isMobile ? '1rem' : '1.1rem',
                px: 2,
                py: isMobile ? 1 : undefined,
              }}
            />
          </Box>

          {/* Spending Items */}
          <Paper elevation={2} sx={{ p: isMobile ? 1.5 : 3, mb: 2 }}>
            <Typography
              variant={isMobile ? 'h6' : 'h6'}
              gutterBottom
              sx={{ mb: isMobile ? 1 : 2 }}
            >
              Spending Items
            </Typography>
            {spendings.length === 0 ? (
              <Typography color='text.secondary' align='center' sx={{ py: 4 }}>
                No spending items recorded for this month.
              </Typography>
            ) : (
              <List sx={{ p: 0 }}>
                {spendings.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <ListItem
                      sx={{
                        px: isMobile ? 0.5 : 0,
                        py: isMobile ? 1 : 1.5,
                        display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row',
                        alignItems: isMobile ? 'flex-start' : 'center',
                        gap: isMobile ? 0.5 : 0,
                      }}
                    >
                      <Box sx={{ flex: 1, width: '100%' }}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: isMobile ? 'flex-start' : 'center',
                            flexDirection: isMobile ? 'column' : 'row',
                            width: '100%',
                          }}
                        >
                          <Typography
                            variant={isMobile ? 'body1' : 'subtitle1'}
                            fontWeight='medium'
                            sx={{ mb: isMobile ? 0.5 : 0 }}
                          >
                            {item.name}
                          </Typography>
                          <Typography
                            variant={isMobile ? 'body1' : 'h6'}
                            color='primary'
                            fontWeight='bold'
                          >
                            ${item.amount.toFixed(2)}
                          </Typography>
                        </Box>
                        <Stack
                          direction='row'
                          spacing={1}
                          alignItems='center'
                          sx={{ mt: isMobile ? 0.5 : 1 }}
                        >
                          {item.amountPaid > 0 && !item.paid ? (
                            <Chip
                              label='Partial Paid'
                              color='warning'
                              size='small'
                            />
                          ) : item.paid ? (
                            <Chip label='Paid' color='success' size='small' />
                          ) : (
                            <Chip label='Unpaid' color='default' size='small' />
                          )}
                          {item.amountPaid > 0 && (
                            <Typography
                              variant='body2'
                              color='text.secondary'
                              sx={{
                                fontSize: isMobile ? '0.85rem' : undefined,
                              }}
                            >
                              Paid: ${item.amountPaid.toFixed(2)}
                            </Typography>
                          )}
                        </Stack>
                        {item.note && (
                          <Typography
                            variant='body2'
                            color='text.secondary'
                            sx={{
                              mt: 0.5,
                              fontSize: isMobile ? '0.85rem' : undefined,
                            }}
                          >
                            Note: {item.note}
                          </Typography>
                        )}
                      </Box>
                    </ListItem>
                    {index < spendings.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Box>
      </Paper>
    </Box>
  );
}
