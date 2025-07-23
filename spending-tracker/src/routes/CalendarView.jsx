import React, { useState } from "react";
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
  Chip,
  IconButton,
  Tooltip,
  Card,
  CardContent,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import useMonthlySpending from "../utils/useMonthlySpending";
import { useNavigate } from "react-router-dom";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const monthsShort = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function CalendarView() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
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

  const getStatusIcon = (status) => {
    switch (status) {
      case "paid":
        return <CheckCircleIcon sx={{ fontSize: 20, color: "#43e97b" }} />;
      case "partial":
        return <WarningIcon sx={{ fontSize: 20, color: "#ff9800" }} />;
      case "unpaid":
        return <ErrorIcon sx={{ fontSize: 20, color: "#ff5722" }} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return {
          bg: "linear-gradient(145deg, #d4edda 0%, #c3e6cb 100%)",
          border: "#28a745",
          text: "#155724",
        };
      case "partial":
        return {
          bg: "linear-gradient(145deg, #fff3cd 0%, #ffeaa7 100%)",
          border: "#ffc107",
          text: "#856404",
        };
      case "unpaid":
        return {
          bg: "linear-gradient(145deg, #f8d7da 0%, #f5c6cb 100%)",
          border: "#dc3545",
          text: "#721c24",
        };
      default:
        return {
          bg: theme.palette.background.paper,
          border: theme.palette.divider,
          text: theme.palette.text.primary,
        };
    }
  };

  const handleYearChange = (direction) => {
    setYear((prev) => (direction === "next" ? prev + 1 : prev - 1));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        background: theme.palette.background.default,
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          pt: { xs: 2, sm: 4 },
          pb: { xs: 4, sm: 6 },
          px: { xs: 1, sm: 4, md: 6 },
          overflow: "hidden",
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 6,
            position: "relative",
          }}
        >
          <Paper
            elevation={12}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1.5, sm: 3 },
              px: { xs: 2, sm: 4 },
              py: { xs: 1.5, sm: 2 },
              borderRadius: { xs: 4, sm: 6 },
              width: "100%",
              maxWidth: "95%",
              background: theme.palette.background.paper,
              backdropFilter: "blur(20px)",
              border: `1px solid ${theme.palette.divider}`,
              boxShadow:
                theme.palette.mode === "dark"
                  ? "0 8px 32px 0 rgba(0,0,0,0.3)"
                  : "0 8px 32px 0 rgba(0,0,0,0.1)",
            }}
          >
            <CalendarTodayIcon
              sx={{
                fontSize: 28,
                color: theme.palette.mode === "dark" ? "#64b5f6" : "#1976d2",
              }}
            />
            <Typography
              variant={isMobile ? "h5" : "h4"}
              fontWeight={800}
              sx={{
                background:
                  theme.palette.mode === "dark"
                    ? "linear-gradient(45deg, #64b5f6 0%, #42a5f5 100%)"
                    : "linear-gradient(45deg, #1976d2 0%, #1565c0 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: 1,
              }}
            >
              Monthly Overview
            </Typography>

            {/* Year Selector */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton
                onClick={() => handleYearChange("prev")}
                size="small"
                sx={{
                  color: theme.palette.primary.main,
                  "&:hover": { bgcolor: "rgba(25, 118, 210, 0.1)" },
                }}
              >
                <ArrowBackIosIcon fontSize="small" />
              </IconButton>

              <Chip
                label={year}
                variant="outlined"
                sx={{
                  fontWeight: 700,
                  fontSize: 16,
                  color: theme.palette.primary.main,
                  borderColor: theme.palette.primary.main,
                  "&:hover": {
                    bgcolor: "rgba(25, 118, 210, 0.1)",
                  },
                }}
              />

              <IconButton
                onClick={() => handleYearChange("next")}
                size="small"
                sx={{
                  color: theme.palette.primary.main,
                  "&:hover": { bgcolor: "rgba(25, 118, 210, 0.1)" },
                }}
              >
                <ArrowForwardIosIcon fontSize="small" />
              </IconButton>
            </Box>
          </Paper>
        </Box>

        {/* Calendar Grid */}
        <Box
          sx={{
            maxWidth: 1200,
            mx: "auto",
            mb: 6,
          }}
        >
          <Grid container spacing={2} sx={{ justifyContent: "center" }}>
            {months.map((month, idx) => {
              const isCurrent = year === currentYear && idx === currentMonth;
              const isSelected = idx === selectedMonth;
              const statusColors =
                monthData && isSelected
                  ? getStatusColor(monthData.status)
                  : getStatusColor();

              return (
                <Grid item xs={6} sm={4} md={3} lg={2} key={month}>
                  <Fade in timeout={300 + idx * 50}>
                    <Card
                      elevation={isSelected ? 12 : 4}
                      sx={{
                        cursor: "pointer",
                        borderRadius: 4,
                        overflow: "hidden",
                        position: "relative",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        transform: isSelected ? "scale(1.05)" : "scale(1)",
                        zIndex: isSelected ? 2 : 1,
                        background: isCurrent
                          ? theme.palette.mode === "dark"
                            ? "#1565c0"
                            : "#e3f2fd"
                          : theme.palette.mode === "dark"
                          ? isSelected
                            ? "linear-gradient(145deg, #1e293b 0%, #334155 100%)"
                            : "linear-gradient(145deg, #1e293b 0%, #2d3748 100%)"
                          : isSelected
                          ? statusColors.bg
                          : "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
                        border: `2px solid ${
                          isCurrent
                            ? theme.palette.primary.main
                            : isSelected
                            ? statusColors.border
                            : "transparent"
                        }`,
                        "&:hover": {
                          transform: "scale(1.08) translateY(-4px)",
                          boxShadow:
                            theme.palette.mode === "dark"
                              ? "0 20px 40px rgba(0,0,0,0.3)"
                              : "0 20px 40px rgba(0,0,0,0.15)",
                          zIndex: 3,
                        },
                      }}
                      onClick={() => setSelectedMonth(idx)}
                    >
                      <CardContent
                        sx={{
                          p: 3,
                          textAlign: "center",
                          position: "relative",
                          "&:last-child": { pb: 3 },
                        }}
                      >
                        <Typography
                          variant={isMobile ? "body1" : "h6"}
                          fontWeight={700}
                          sx={{
                            color: isCurrent
                              ? theme.palette.mode === "dark"
                                ? "#ffffff"
                                : theme.palette.primary.main
                              : theme.palette.mode === "dark"
                              ? "#e2e8f0"
                              : isSelected
                              ? statusColors.text
                              : theme.palette.text.primary,
                            letterSpacing: 1,
                            mb: 1,
                            fontWeight: isCurrent ? 700 : 700,
                          }}
                        >
                          {isMobile ? monthsShort[idx] : month}
                        </Typography>

                        {isSelected && monthData && (
                          <Box sx={{ mt: 1 }}>
                            {getStatusIcon(monthData.status)}
                            <Typography
                              variant="caption"
                              sx={{
                                display: "block",
                                mt: 0.5,
                                color: statusColors.text,
                                fontWeight: 600,
                              }}
                            >
                              ${monthData.total?.toFixed(0) || "0"}
                            </Typography>
                          </Box>
                        )}

                        {isCurrent && (
                          <Box
                            sx={{
                              position: "absolute",
                              top: 8,
                              right: 8,
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              background:
                                theme.palette.mode === "dark"
                                  ? "#ffffff"
                                  : theme.palette.primary.main,
                            }}
                          />
                        )}
                      </CardContent>
                    </Card>
                  </Fade>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        {/* Monthly Details */}
        {selectedMonth !== null && (
          <Fade in timeout={500}>
            <Box sx={{ maxWidth: 800, mx: "auto" }}>
              <Paper
                elevation={16}
                sx={{
                  borderRadius: 6,
                  overflow: "hidden",
                  background: theme.palette.background.paper,
                  backdropFilter: "blur(20px)",
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                {/* Header */}
                <Box
                  sx={{
                    p: 4,
                    background:
                      theme.palette.mode === "dark"
                        ? "linear-gradient(135deg, #1e293b 0%, #334155 100%)"
                        : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    position: "relative",
                  }}
                >
                  <Typography variant="h5" fontWeight={700} align="center">
                    {months[selectedMonth]} {year}
                  </Typography>
                  {monthData && (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", mt: 2 }}
                    >
                      <Chip
                        icon={getStatusIcon(monthData.status)}
                        label={monthData.status?.toUpperCase() || "NO DATA"}
                        sx={{
                          bgcolor: "rgba(255, 255, 255, 0.2)",
                          color: "white",
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                  )}
                </Box>

                {/* Content */}
                <Box sx={{ p: { xs: 2, sm: 4 } }}>
                  {monthLoading ? (
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      <Typography>Loading...</Typography>
                    </Box>
                  ) : monthData ? (
                    <>
                      {/* Summary Cards */}
                      <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={6} md={3}>
                          <Card elevation={4} sx={{ borderRadius: 3 }}>
                            <CardContent sx={{ textAlign: "center", py: 2 }}>
                              <TrendingUpIcon color="primary" sx={{ mb: 1 }} />
                              <Typography variant="h6" fontWeight={700}>
                                {monthData.items?.length || 0}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Total Items
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>

                        <Grid item xs={6} md={3}>
                          <Card elevation={4} sx={{ borderRadius: 3 }}>
                            <CardContent sx={{ textAlign: "center", py: 2 }}>
                              <AccountBalanceWalletIcon
                                color="primary"
                                sx={{ mb: 1 }}
                              />
                              <Typography variant="h6" fontWeight={700}>
                                ${monthData.total?.toFixed(2) || "0.00"}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Total Amount
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>

                        <Grid item xs={6} md={3}>
                          <Card elevation={4} sx={{ borderRadius: 3 }}>
                            <CardContent sx={{ textAlign: "center", py: 2 }}>
                              <CheckCircleIcon
                                sx={{ color: "#43e97b", mb: 1 }}
                              />
                              <Typography
                                variant="h6"
                                fontWeight={700}
                                color="#43e97b"
                              >
                                $
                                {monthData.items
                                  ? monthData.items
                                      .reduce(
                                        (sum, s) => sum + (s.amountPaid || 0),
                                        0
                                      )
                                      .toFixed(2)
                                  : "0.00"}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Paid
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>

                        <Grid item xs={6} md={3}>
                          <Card elevation={4} sx={{ borderRadius: 3 }}>
                            <CardContent sx={{ textAlign: "center", py: 2 }}>
                              <ErrorIcon sx={{ color: "#ff5722", mb: 1 }} />
                              <Typography
                                variant="h6"
                                fontWeight={700}
                                color="#ff5722"
                              >
                                $
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
                                  : "0.00"}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Unpaid
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>

                      <Divider sx={{ my: 3 }} />

                      {/* Items List */}
                      <Box>
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          sx={{ mb: 2 }}
                        >
                          Items Detail
                        </Typography>
                        <Box
                          sx={{
                            maxHeight: { xs: "none", sm: 300 },
                            overflowY: { xs: "visible", sm: "auto" },
                            "&::-webkit-scrollbar": {
                              width: { xs: 0, sm: 8 },
                              background: "transparent",
                            },
                            "&::-webkit-scrollbar-thumb": {
                              background: { xs: "transparent", sm: "#c1c8d1" },
                              borderRadius: 4,
                            },
                            "&::-webkit-scrollbar-thumb:hover": {
                              background: { xs: "transparent", sm: "#a0aec0" },
                            },
                            scrollbarWidth: { xs: "none", sm: "thin" },
                            scrollbarColor: {
                              xs: "auto",
                              sm: "#c1c8d1 transparent",
                            },
                          }}
                        >
                          {monthData.items && monthData.items.length > 0 ? (
                            monthData.items.map((item, i) => (
                              <Card
                                key={i}
                                elevation={2}
                                sx={{
                                  mb: 1.5,
                                  borderRadius: 2,
                                  border: `1px solid ${
                                    item.paid ? "#43e97b" : "#ff5722"
                                  }22`,
                                }}
                              >
                                <CardContent
                                  sx={{
                                    py: 2,
                                    px: 3,
                                    "&:last-child": { pb: 2 },
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Box>
                                      <Typography
                                        variant="subtitle2"
                                        fontWeight={600}
                                      >
                                        {item.name}
                                      </Typography>
                                      <Typography
                                        variant="body1"
                                        color="primary"
                                        fontWeight={700}
                                      >
                                        ${item.amount.toFixed(2)}
                                      </Typography>
                                    </Box>
                                    <Chip
                                      size="small"
                                      label={item.paid ? "PAID" : "UNPAID"}
                                      color={item.paid ? "success" : "error"}
                                      variant="outlined"
                                    />
                                  </Box>
                                </CardContent>
                              </Card>
                            ))
                          ) : (
                            <Typography
                              color="text.secondary"
                              align="center"
                              sx={{ py: 4 }}
                            >
                              No spendings recorded for this month.
                            </Typography>
                          )}
                        </Box>
                      </Box>

                      {/* Action Button */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          mt: 4,
                        }}
                      >
                        <Button
                          variant="contained"
                          size="large"
                          onClick={() =>
                            navigate(`/dashboard/${year}/${selectedMonth + 1}`)
                          }
                          startIcon={<CalendarTodayIcon />}
                          sx={{
                            fontWeight: 700,
                            fontSize: 16,
                            px: 4,
                            py: 1.5,
                            borderRadius: 3,
                            background:
                              "linear-gradient(45deg, #667eea 0%, #764ba2 100%)",
                            boxShadow: "0 8px 24px rgba(102, 126, 234, 0.4)",
                            "&:hover": {
                              background:
                                "linear-gradient(45deg, #764ba2 0%, #667eea 100%)",
                              boxShadow: "0 12px 32px rgba(102, 126, 234, 0.5)",
                              transform: "translateY(-2px)",
                            },
                          }}
                        >
                          View in Dashboard
                        </Button>
                      </Box>
                    </>
                  ) : (
                    <Typography
                      align="center"
                      color="text.secondary"
                      sx={{ py: 4 }}
                    >
                      No data available for this month.
                    </Typography>
                  )}
                </Box>
              </Paper>
            </Box>
          </Fade>
        )}
      </Box>
    </Box>
  );
}
