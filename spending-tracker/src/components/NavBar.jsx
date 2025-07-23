import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  useMediaQuery,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { auth } from "../utils/firebase";

export default function NavBar({ mode, toggleMode }) {
  const handleLogout = () => {
    auth.signOut();
  };
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleNav = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={{
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(8px)",
        borderRadius: 0,
        boxShadow: "0 2px 16px 0 rgba(33, 154, 111, 0.08)",
        borderBottom: "1px solid #e0eafc",
        width: "100%",
        overflowX: "hidden",
        boxSizing: "border-box",
      }}
    >
      <Container
        maxWidth="xl"
        disableGutters
        sx={{
          width: "100%",
          px: isMobile ? 1 : 3,
          boxSizing: "border-box",
          overflowX: "hidden",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            minHeight: isMobile ? 56 : 72,
            px: 0,
            width: "100%",
            boxSizing: "border-box",
            overflowX: "hidden",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <img
              src="/pwa-192x192.png"
              alt="logo"
              style={{ width: 40, height: 40, borderRadius: "50%" }}
            />
            <Typography
              variant="h6"
              fontWeight={800}
              color="black"
              sx={{
                letterSpacing: 1,
                fontSize: isMobile ? 18 : 24,
                whiteSpace: "nowrap",
                userSelect: "none",
                color: "black",
              }}
            >
              Spending Tracker
            </Typography>
          </Box>
          {isMobile ? (
            <>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0 }}>
                <IconButton
                  onClick={toggleMode}
                  color="inherit"
                  sx={{ color: "black", mr: -1 }}
                >
                  {mode === "dark" ? (
                    <Brightness7Icon sx={{ color: "black" }} />
                  ) : (
                    <Brightness4Icon sx={{ color: "black" }} />
                  )}
                </IconButton>
                <IconButton
                  onClick={() => setDrawerOpen(true)}
                  color="inherit"
                  sx={{ color: mode === "dark" ? "black" : undefined }}
                >
                  <MenuIcon
                    sx={{ color: mode === "dark" ? "black" : undefined }}
                  />
                </IconButton>
              </Box>
              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                PaperProps={{ sx: { background: "#232a3a", color: "white" } }}
              >
                <Box sx={{ width: 220, pt: 2 }} role="presentation">
                  <List>
                    <ListItem disablePadding>
                      <ListItemButton
                        selected={location.pathname === "/dashboard"}
                        onClick={() => handleNav("/dashboard")}
                      >
                        <ListItemIcon sx={{ color: "white" }}>
                          <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary="Dashboard" />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton
                        selected={location.pathname === "/calendar"}
                        onClick={() => handleNav("/calendar")}
                      >
                        <ListItemIcon sx={{ color: "white" }}>
                          <CalendarMonthIcon />
                        </ListItemIcon>
                        <ListItemText primary="Monthly Calendar" />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={handleLogout}
                        sx={{
                          color: "#ff4d4d",
                          mt: 1,
                          borderTop: 1,
                          borderColor: "rgba(255,255,255,0.12)",
                        }}
                      >
                        <ListItemIcon sx={{ color: "#ff4d4d" }}>
                          <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                      </ListItemButton>
                    </ListItem>
                  </List>
                </Box>
              </Drawer>
            </>
          ) : (
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                color={
                  location.pathname === "/dashboard" ? "primary" : "inherit"
                }
                startIcon={<DashboardIcon />}
                onClick={() => navigate("/dashboard")}
                sx={{
                  fontWeight: 700,
                  fontSize: 16,
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  boxShadow: location.pathname === "/dashboard" ? 2 : 0,
                  background:
                    location.pathname === "/dashboard"
                      ? "rgba(33,154,111,0.08)"
                      : "transparent",
                  transition: "all 0.2s",
                  "&:hover": {
                    background: "rgba(33,154,111,0.15)",
                  },
                  whiteSpace: "nowrap",
                  minWidth: 0,
                  color: "black",
                }}
              >
                Dashboard
              </Button>
              <Button
                color={
                  location.pathname === "/calendar" ? "primary" : "inherit"
                }
                startIcon={<CalendarMonthIcon />}
                onClick={() => navigate("/calendar")}
                sx={{
                  fontWeight: 700,
                  fontSize: 16,
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  boxShadow: location.pathname === "/calendar" ? 2 : 0,
                  background:
                    location.pathname === "/calendar"
                      ? "rgba(33,154,111,0.08)"
                      : "transparent",
                  transition: "all 0.2s",
                  "&:hover": {
                    background: "rgba(33,154,111,0.15)",
                  },
                  whiteSpace: "nowrap",
                  minWidth: 0,
                  color: "black",
                }}
              >
                Monthly Calendar
              </Button>
              <IconButton
                onClick={toggleMode}
                color="inherit"
                sx={{ ml: 1, color: "black" }}
              >
                {mode === "dark" ? (
                  <Brightness7Icon sx={{ color: "black" }} />
                ) : (
                  <Brightness4Icon sx={{ color: "black" }} />
                )}
              </IconButton>
              <Button
                color="inherit"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{
                  fontWeight: 700,
                  fontSize: 16,
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  transition: "all 0.2s",
                  "&:hover": {
                    background: "rgba(255,77,77,0.08)",
                  },
                  whiteSpace: "nowrap",
                  minWidth: 0,
                  color: "#ff4d4d",
                }}
              >
                Logout
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
