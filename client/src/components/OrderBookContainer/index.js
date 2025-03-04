import React from "react";
import { useTheme, Paper } from "@mui/material";
import OrderBookChart from "./OrderBookCharts";
import OrderBookTable from "./OrderBookTable";
import SelectCyptoPair from "./SelectCyptoPair";
import OrderForm from "./OrderForm";

const OrderBookContainer = ({ data }) => {
  const theme = useTheme();
  const { dataLoaded } = data;

  return (
    <>
      <SelectCyptoPair />
      {dataLoaded && (
        <>
          <OrderForm />
          <Paper
            elevation={3}
            style={{ borderRadius: theme.shape.borderRadius }}
          >
            <OrderBookChart data={data} />
            <OrderBookTable asks={data.asks} bids={data.bids} />
          </Paper>
        </>
      )}
    </>
  );
};

export default OrderBookContainer;
