import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  useMediaQuery,
  Select,
  MenuItem,
  Fade,
  Divider,
  Button,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import useMonthlySpending from '../utils/useMonthlySpending';
import { useNavigate } from 'react-router-dom';

const months = [
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

export default function CalendarView() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const currentMonth = new Date().getMonth();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const { data: monthData, loading: monthLoading } = useMonthlySpending(
    year,
    selectedMonth + 1
  );
  const navigate = useNavigate();

  const yearOptions = Array.from({ length: 8 }, (_, i) => currentYear - 5 + i);

  return (
    <Box
      sx={{
        minHeight: '92vh',
        width: '100vw',
        background: theme.palette.background.default,
        m: 0,
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
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
            gap: 2,
          }}
        >
          <Typography variant='h4' fontWeight={700} align='center' gutterBottom>
            Monthly Calendar
          </Typography>
          <Select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            size='small'
            sx={{ ml: 2, fontWeight: 700, fontSize: 20 }}
          >
            {yearOptions.map((y) => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Paper
          elevation={8}
          sx={{
            width: { xs: '100%', sm: '90%', md: '70%' },
            maxWidth: 1000,
            mx: 'auto',
            my: 4,
            p: isMobile ? 2 : 5,
            borderRadius: 4,
            background: theme.palette.background.paper,
            border: `2.5px solid ${
              theme.palette.mode === 'dark' ? '#223366' : '#e0eafc'
            }`,
          }}
        >
          <Grid
            container
            spacing={3}
            sx={{ mt: 2, width: '100%', mx: 'auto', justifyContent: 'center' }}
          >
            {months.map((month, idx) => {
              const isCurrent = year === currentYear && idx === currentMonth;
              // Determine color by status
              let bgColor = 'rgba(255,255,255,0.72)';
              if (monthData && idx === selectedMonth) {
                if (monthData.status === 'paid')
                  bgColor = 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';
                else if (monthData.status === 'partial')
                  bgColor = 'linear-gradient(135deg, #fffbe6 0%, #ffe066 100%)';
                else if (monthData.status === 'unpaid')
                  bgColor = 'linear-gradient(135deg, #ffeaea 0%, #ff7675 100%)';
              }
              return (
                <Grid item xs={4} sm={3} md={3} key={month}>
                  <Fade in timeout={500 + idx * 60}>
                    <Paper
                      elevation={4}
                      sx={{
                        p: 3,
                        textAlign: 'center',
                        borderRadius: 4,
                        fontWeight: 700,
                        fontSize: { xs: 13, sm: 18, md: 22 },
                        color: '#1976d2',
                        letterSpacing: 1.5,
                        textShadow: isCurrent
                          ? '0 2px 10px rgba(33,154,111,0.25),0 1px 1px #0002'
                          : '0 1px 2px #1976d229',
                        background:
                          theme.palette.mode === 'dark'
                            ? isCurrent
                              ? 'linear-gradient(135deg, #232a3a 0%, #2c3e50 100%)'
                              : '#232a3a'
                            : bgColor,
                        border:
                          theme.palette.mode === 'dark'
                            ? isCurrent
                              ? '3.5px solid #38f9d7'
                              : '2px solid #223366'
                            : isCurrent
                            ? '3.5px solid #38f9d7'
                            : '2px solid #e0eafc',
                        boxShadow:
                          theme.palette.mode === 'dark'
                            ? isCurrent
                              ? '0 0 12px 0 #38f9d7aa'
                              : '0 2px 8px 0 #22336633'
                            : isCurrent
                            ? '0 6px 32px 0 rgba(33,154,111,0.25),0 2px 12px 0 #38f9d733'
                            : '0 2px 12px 0 rgba(33,154,111,0.08)',
                        overflow: 'hidden',
                        backdropFilter: 'blur(5px)',
                        position: 'relative',
                        transition:
                          'all 0.22s cubic-bezier(.4,2,.6,1), box-shadow 0.24s, background 0.18s',
                        cursor: 'pointer',
                        '&:hover': {
                          background: isCurrent
                            ? 'linear-gradient(135deg, #38f9d7 0%, #43e97b 100%)'
                            : 'linear-gradient(135deg, #b2fefa 10%, #0ed2f7 100%)',
                          color: 'white',
                          boxShadow:
                            '0 10px 32px 0 rgba(33,154,111,0.21), 0 1.5px 8px 0 #0ed2f755',
                          border: isCurrent
                            ? '2.5px solid #43e97b'
                            : '2.5px solid #0ed2f7',
                          transform: 'translateY(-4px) scale(1.07)',
                          zIndex: 2,
                        },
                        '&:active': {
                          transform: 'scale(0.98)',
                        },
                        mb: 2,
                      }}
                      onClick={() => setSelectedMonth(idx)}
                      tabIndex={0}
                    >
                      {month}
                    </Paper>
                  </Fade>
                </Grid>
              );
            })}
          </Grid>
          {/* Summary Table Below Months Select */}
          {selectedMonth !== null && (
            <Box sx={{ mt: 4, width: '100%', maxWidth: 600, mx: 'auto' }}>
              <Typography
                variant='h6'
                fontWeight={700}
                align='center'
                gutterBottom
              >
                {months[selectedMonth]} {year} Overview
              </Typography>
              {monthLoading ? (
                <Typography align='center'>Loading...</Typography>
              ) : monthData ? (
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    background: theme.palette.background.paper,
                    border: `2.5px solid ${
                      theme.palette.mode === 'dark' ? '#223366' : '#e0eafc'
                    }`,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 2,
                    }}
                  >
                    <Typography>
                      Total Items: {monthData.items?.length || 0}
                    </Typography>
                    <Typography>
                      Total Amount: ${monthData.total?.toFixed(2) || '0.00'}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 2,
                    }}
                  >
                    <Typography>
                      Paid: $
                      {monthData.items
                        ? monthData.items
                            .reduce((sum, s) => sum + (s.amountPaid || 0), 0)
                            .toFixed(2)
                        : '0.00'}
                    </Typography>
                    <Typography>
                      Unpaid: $
                      {monthData.items
                        ? (
                            monthData.items.reduce(
                              (sum, s) => sum + (s.amount || 0),
                              0
                            ) -
                            monthData.items.reduce(
                              (sum, s) => sum + (s.amountPaid || 0),
                              0
                            )
                          ).toFixed(2)
                        : '0.00'}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 1 }} />
                  <Typography fontWeight={600} sx={{ mt: 1 }}>
                    Items:
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {monthData.items && monthData.items.length > 0 ? (
                      monthData.items.map((item, i) => (
                        <li key={i}>
                          {item.name} - ${item.amount.toFixed(2)}{' '}
                          {item.paid ? '(Paid)' : ''}
                        </li>
                      ))
                    ) : (
                      <li>No spendings for this month.</li>
                    )}
                  </ul>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}
                  >
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={() =>
                        navigate(`/dashboard/${year}/${selectedMonth + 1}`)
                      }
                      startIcon={<CalendarTodayIcon />}
                      sx={{ fontWeight: 700, fontSize: 16 }}
                    >
                      View in Dashboard
                    </Button>
                  </Box>
                </Paper>
              ) : (
                <Typography align='center' color='text.secondary'>
                  No data for this month.
                </Typography>
              )}
            </Box>
          )}{' '}
        </Paper>
      </Paper>
    </Box>
  );
}
