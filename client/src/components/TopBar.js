import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Divider,
  ListItemText,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle"; // Import the user account icon

import { useSocket } from "../SocketContext";

const TopBar = () => {
  const { identified, user, onSignOut, onSignIn } = useSocket();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" color="default" elevation={0}>
      <Toolbar sx={{ justifyContent: "flex-end" }}>
        {identified ? (
          <>
            <IconButton onClick={handleMenu} size="large" sx={{ p: 0 }}>
              <Avatar sx={{ bgcolor: "primary.main" }}>
                <AccountCircleIcon />
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem>
                <ListItemText>{user.name}</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem onClick={onSignOut}>Sign Out</MenuItem>
            </Menu>
          </>
        ) : (
          <Button color="inherit" onClick={onSignIn}>
            Sign In
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
