import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { useSocket } from "../../SocketContext";

export default function OrderForm() {
  const { onOrder } = useSocket();
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [type, setType] = useState("buy"); // 'buy' or 'sell'

  const handleSubmit = (event) => {
    event.preventDefault();
    setPrice("");
    setQuantity("");

    if (price <= 0 || quantity <= 0) {
      alert(
        "Please enter valid price and quantity values. Both must be greater than zero."
      );
      return;
    }

    onOrder({ price, quantity, type });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{
        my: 1,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 2,
      }}
    >
      <TextField
        size="small"
        required
        label="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        type="number"
        sx={{ width: "150px" }}
      />
      <TextField
        size="small"
        required
        label="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        type="number"
        sx={{ width: "150px" }}
      />
      <Button
        type="submit"
        variant="contained"
        sx={{
          flexGrow: 0,
          backgroundColor: type === "buy" ? "#2e7d32" : "#d32f2f", // Green for buy, Red for sell
          "&:hover": {
            backgroundColor: type === "buy" ? "#388e3c" : "#f44336", // Darken on hover
          },
        }}
      >
        Submit Order
      </Button>
      <Button
        variant="outlined"
        size="small"
        onClick={() => setType(type === "buy" ? "sell" : "buy")}
        sx={{ flexGrow: 0 }}
      >
        Switch to {type === "buy" ? "Sell" : "Buy"}
      </Button>
    </Box>
  );
}
