import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "@mui/material";
import { max } from "d3-array";

const OrderBookChart = ({ data }) => {
  const theme = useTheme();

  // Create maps for quick lookup
  const bidMap = new Map(data.bids.map((bid) => [bid.price, bid.quantity]));
  const askMap = new Map(data.asks.map((ask) => [ask.price, ask.quantity]));

  // Find all unique prices
  const allPrices = Array.from(
    new Set([...bidMap.keys(), ...askMap.keys()])
  ).sort((a, b) => a - b);

  // Combine bids and asks into a single array
  const combinedData = allPrices.map((price) => ({
    price,
    bid: bidMap.has(price) ? bidMap.get(price) : null, // Use null instead of 0
    ask: askMap.has(price) ? askMap.get(price) : null, // Use null instead of 0
  }));

  // Calculate maximum quantity for Y-axis scale
  const maxQuantity = max(combinedData, (d) =>
    Math.max(d.bid || 0, d.ask || 0)
  );

  return (
    <ResponsiveContainer height={300}>
      <AreaChart
        data={combinedData}
        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="bidGradient" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor={theme.palette.success.main}
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor={theme.palette.success.main}
              stopOpacity={0}
            />
          </linearGradient>
          <linearGradient id="askGradient" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor={theme.palette.error.main}
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor={theme.palette.error.main}
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="price"
          axisLine={false}
          tickLine={false}
          tick={{
            fill: theme.palette.text.secondary,
            fontSize: theme.typography.caption.fontSize,
          }}
        />
        <YAxis
          domain={[0, maxQuantity]}
          axisLine={false}
          tickLine={false}
          tick={{
            fill: theme.palette.text.secondary,
            fontSize: theme.typography.caption.fontSize,
          }}
        />
        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
        <Tooltip
          contentStyle={{
            backgroundColor: theme.palette.background.paper,
            borderColor: theme.palette.divider,
            borderRadius: theme.shape.borderRadius,
          }}
          itemStyle={{ color: theme.palette.text.primary }}
          cursor={{ stroke: theme.palette.primary.main, strokeWidth: 2 }}
        />
        <Area
          type="step"
          dataKey="bid"
          stroke={theme.palette.success.main}
          fillOpacity={1}
          fill="url(#bidGradient)"
        />
        <Area
          type="step"
          dataKey="ask"
          stroke={theme.palette.error.main}
          fillOpacity={1}
          fill="url(#askGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default OrderBookChart;
