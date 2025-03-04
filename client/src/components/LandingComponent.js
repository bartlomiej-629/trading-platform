import React from "react";
import {
  Typography,
  Box,
  Container,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import ChartImage from "../image/chart.png";

const LandingComponent = () => {
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Container maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
      <Box sx={{ mb: 4 }}>
        <img
          src={ChartImage} // Replace with the path to your image file
          alt="Crypto Chart"
          style={{ width: "auto", height: 60, marginBottom: 16 }} // Adjust size as needed
        />
        <Typography
          component="h1"
          variant={matchesSM ? "h3" : "h2"}
          color="text.primary"
          gutterBottom
        >
          Welcome to CryptoStream
        </Typography>
      </Box>
      <Typography variant={matchesSM ? "body1" : "h5"} color="text.secondary">
        Dive into the real-time crypto market with CryptoStream. <br />
        Track your favorite crypto pairs and make informed decisions with live
        order book and trade updates.
      </Typography>
    </Container>
  );
};

export default LandingComponent;
