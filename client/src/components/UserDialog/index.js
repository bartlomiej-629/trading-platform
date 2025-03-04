import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { useSocket } from "../../SocketContext";

const IdentificationDialog = () => {
  const {
    identified,
    setIdentified,
    socket,
    askForIdentification,
    setAskForIdentification,
  } = useSocket();
  const [name, setName] = useState("");

  const handleIdentification = () => {
    if (name.trim()) {
      socket.emit("identify", name);
      setAskForIdentification(false);
    }
  };

  const handleClose = () => {
    setAskForIdentification(false);
  };

  return (
    <Dialog open={askForIdentification} onClose={handleClose}>
      <DialogTitle>Identify Yourself</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To subscribe to crypto pairs, please enter your name.
          <br />
          Default: Alice
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Name"
          type="text"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleIdentification} disabled={!name}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default IdentificationDialog;
