import { createTheme, ThemeProvider } from "@mui/material/styles";
import React from "react";
import { Container } from "@mui/material";

import { SocketProvider, useSocket } from "./SocketContext";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";

import IdentificationDialog from "./components/UserDialog";
import OrderBookContainer from "./components/OrderBookContainer";
import TopBar from "./components/TopBar";
import LandingComponent from "./components/LandingComponent";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "ws://localhost:4000";

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: createTheme().palette.info.main,
    },
  },
});

const AppContainter = () => {
  const { orderbookData, identified } = useSocket();
  return (
    <Container maxWidth="md" component="main" sx={{ pt: 8, pb: 6 }}>
      {identified ? (
        <OrderBookContainer data={orderbookData} />
      ) : (
        <LandingComponent />
      )}
    </Container>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={5}>
        <SocketProvider SOCKET_URL={SOCKET_URL}>
          <IdentificationDialog />
          <TopBar />
          <AppContainter />
        </SocketProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;
