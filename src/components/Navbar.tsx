import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  Avatar,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Logout } from "@mui/icons-material";

interface HomeNavbarProps {
  currentPage: "login" | "/" | "chat";
  selectedProfileId: string;
  handleLogin: () => void;
  handleSelectProfile: (profileId: string) => void;
  handleBackToHome: () => void;
  handleLogout: () => void;
}

export default function Navbar() {
  return (
    <>navba</>
    // <AppBar position="static" color="primary" elevation={0}>
    //   <Container maxWidth="lg">
    //     <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
    //       {/* Brand Logo */}
    //       <Typography
    //         variant="h6"
    //         component={Link}
    //         to="/"
    //         sx={{
    //           fontWeight: 700,
    //           color: "inherit",
    //           textDecoration: "none",
    //           textTransform: "uppercase",
    //           letterSpacing: "0.1em",
    //         }}
    //       >
    //         AI Chatbot
    //       </Typography>

    //       {/* Navigation Links */}
    //       <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
    //         {currentPage !== "login" && (
    //           <>
    //             <Button
    //               color="inherit"
    //               component={Link}
    //               to="/"
    //               onClick={handleBackToHome}
    //               sx={{
    //                 textTransform: "none",
    //                 "&:hover": { textDecoration: "underline" },
    //               }}
    //             >
    //               Home
    //             </Button>
    //             {selectedProfileId && (
    //               <Button
    //                 color="inherit"
    //                 component={Link}
    //                 to="/chat"
    //                 onClick={() => handleSelectProfile(selectedProfileId)}
    //                 sx={{
    //                   textTransform: "none",
    //                   "&:hover": { textDecoration: "underline" },
    //                 }}
    //               >
    //                 Chat
    //               </Button>
    //             )}
    //             <Avatar
    //               sx={{
    //                 width: 32,
    //                 height: 32,
    //                 bgcolor: "secondary.main",
    //                 cursor: "pointer",
    //               }}
    //               onClick={handleAvatarClick}
    //             >
    //               {selectedProfileId ? selectedProfileId[0].toUpperCase() : "U"}
    //             </Avatar>
    //             <Menu
    //               anchorEl={anchorEl}
    //               id="account-menu"
    //               open={open}
    //               onClose={handleCloseLogout}
    //               onClick={handleCloseLogout}
    //               PaperProps={{
    //                 elevation: 0,
    //                 sx: {
    //                   overflow: "visible",
    //                   filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
    //                   mt: 1.5,
    //                   "& .MuiAvatar-root": {
    //                     width: 32,
    //                     height: 32,
    //                     ml: -0.5,
    //                     mr: 1,
    //                   },
    //                   "&:before": {
    //                     content: '""',
    //                     display: "block",
    //                     position: "absolute",
    //                     top: 0,
    //                     right: 14,
    //                     width: 10,
    //                     height: 10,
    //                     bgcolor: "background.paper",
    //                     transform: "translateY(-50%) rotate(45deg)",
    //                     zIndex: 0,
    //                   },
    //                 },
    //               }}
    //               transformOrigin={{ horizontal: "right", vertical: "top" }}
    //               anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    //             >
    //               <MenuItem onClick={handleLogoutRequest}>
    //                 <ListItemIcon>
    //                   <Logout fontSize="small" style={{ color: "blue" }} />
    //                 </ListItemIcon>
    //                 Logout
    //               </MenuItem>
    //             </Menu>
    //           </>
    //         )}
    //         {currentPage === "login" && (
    //           <Button
    //             color="inherit"
    //             component={Link}
    //             to="/login"
    //             onClick={handleLogin}
    //             sx={{
    //               textTransform: "none",
    //               "&:hover": { textDecoration: "underline" },
    //             }}
    //           >
    //             Login
    //           </Button>
    //         )}
    //       </Box>
    //     </Toolbar>
    //   </Container>
    // </AppBar>
  );
}
