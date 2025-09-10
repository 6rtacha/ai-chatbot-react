// App.tsx
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";
import {
  Home as HomeIcon,
  Chat as ChatIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";

// Import pages
import HomePage from "./screens/Home";
import ChatPage from "./screens/Chat";
import LoginPage from "./screens/Login";
import SignupPage from "./screens/Signup";
import UserService from "./services/UserService";

export type User = {
  username: string;
  isLoggedIn: boolean;
};

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#9c27b0" },
  },
});

const App: React.FC = () => {
  const [user, setUser] = useState<User>({ username: "", isLoggedIn: false });
  const navigate = useNavigate();
  const userDataString = localStorage.getItem("userData");
  let userData = null;
  if (userDataString) {
    userData = JSON.parse(userDataString);
  }

  const handleLogin = (username: string) => {
    setUser({ username, isLoggedIn: true });
  };

  const handleLogout = async () => {
    try {
      const userService = new UserService();
      await userService.logout();

      console.log("logout");

      localStorage.removeItem("userData");
      setUser({ username: "", isLoggedIn: false });

      // Redirect
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        {/* Navigation Bar */}
        <AppBar
          position="static"
          sx={{
            background: "linear-gradient(45deg, #1976d2 30%, #9c27b0 90%)",
          }}
        >
          <Toolbar>
            <ChatIcon sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              ChatBot AI
            </Typography>

            <Button
              color="inherit"
              startIcon={<HomeIcon />}
              component={Link}
              to="/"
            >
              Home
            </Button>

            <Button
              color="inherit"
              startIcon={<ChatIcon />}
              component={Link}
              to="/chat"
            >
              Chat
            </Button>

            {userData ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar
                    sx={{ width: 32, height: 32, bgcolor: "secondary.main" }}
                  ></Avatar>
                  <Typography variant="body2">{userData.username}</Typography>
                </Box>
                <Button
                  color="inherit"
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                  sx={{
                    bgcolor: "error.main",
                    "&:hover": { bgcolor: "error.dark" },
                  }}
                >
                  Logout
                </Button>
              </Box>
            ) : (
              <Button
                color="inherit"
                startIcon={<LoginIcon />}
                component={Link}
                to="/login"
              >
                Login
              </Button>
            )}
          </Toolbar>
        </AppBar>

        {/* Page Routing */}
        <main>
          <Routes>
            <Route path="/" element={<HomePage user={user} />} />
            <Route
              path="/chat"
              element={
                user.isLoggedIn ? (
                  <ChatPage user={user} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/login"
              element={
                user.isLoggedIn ? (
                  <Navigate to="/" replace />
                ) : (
                  <LoginPage onLogin={handleLogin} />
                )
              }
            />
            <Route
              path="/signup"
              element={
                <SignupPage
                  onSignup={(data) => {
                    console.log("Signed up:", data);
                    // e.g. call API and redirect to login
                  }}
                />
              }
            />
            {/* Catch-all → Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </Box>
    </ThemeProvider>
  );
};

export default App;
