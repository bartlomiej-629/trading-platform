import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
} from "@mui/material";

const calculateTotals = (data) => {
  let runningTotal = 0;
  return data.map((item) => {
    runningTotal += item.quantity * item.price;
    return {
      ...item,
      quantity: item.quantity.toFixed(2),
      total: runningTotal.toFixed(2),
    };
  });
};

const OrderBook = ({ asks, bids }) => {
  bids.sort((a, b) => b.price - a.price);

  const textColors = {
    bids: "#808000", // Olive color for bids
    asks: "#FF7F50", // Coral color for asks
  };

  const askColumns = [
    { label: "Price", accessor: "price" },
    { label: "Quantity", accessor: "quantity" },
    { label: "Total", accessor: "total" },
  ];

  const bidColumns = [
    { label: "Total", accessor: "total" },
    { label: "Quantity", accessor: "quantity" },
    { label: "Price", accessor: "price" },
  ];

  const askData = calculateTotals(asks);
  const bidData = calculateTotals(bids);

  const renderTable = (data, columns, tableType) => (
    <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.accessor}
                sx={{
                  textAlign: "center",
                  // Apply sophisticated color to the price column
                  ...(column.accessor === "price"
                    ? { color: textColors[tableType] }
                    : {}),
                }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column) => (
                <TableCell
                  key={column.accessor}
                  sx={{
                    textAlign: "center",
                    // Apply sophisticated color to the price column
                    ...(column.accessor === "price"
                      ? { color: textColors[tableType] }
                      : {}),
                  }}
                >
                  {row[column.accessor]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Grid
      container
      spacing={2}
      sx={{ padding: "16px", justifyContent: "center" }}
    >
      <Grid item xs={12} sm={10} md={6} lg={4} sx={{ padding: "8px" }}>
        {renderTable(bidData, bidColumns, "bids")}
      </Grid>
      <Grid item xs={12} sm={10} md={6} lg={4} sx={{ padding: "8px" }}>
        {renderTable(askData, askColumns, "asks")}
      </Grid>
    </Grid>
  );
};

export default OrderBook;
