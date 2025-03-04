import React, { createContext, useContext, useState, useEffect } from "react";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";
import { updateOrderBookWithNewOrder, updateOrderBookWithTrade } from "./utils";

import io from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children, SOCKET_URL }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState({
    id: null,
    name: "",
  });
  const [selectedPair, setSelectedPair] = useState(-1);
  const [cryptoPairs, setCryptoPairs] = useState([]);
  const [orderbookData, setOrderbookData] = useState({
    bids: [],
    asks: [],
    dataLoaded: false,
  });
  const [identified, setIdentified] = useState(!!localStorage.getItem("token"));
  const [askForIdentification, setAskForIdentification] = useState(false);

  useEffect(() => {
    const newSocket = io(SOCKET_URL, { autoConnect: false });
    setSocket(newSocket);

    newSocket.on("orderbook_new", (message) => {
      setOrderbookData((data) => updateOrderBookWithNewOrder(data, message));
    });

    newSocket.on("trade", (message) => {
      const { quantity, price, timeStamp } = message;

      const formattedTime = new Date(timeStamp).toLocaleString("en-US", {
        hour12: true,
      });
      const notification = `Trade executed: ${quantity.toFixed(
        2
      )} units at $${price}. [${formattedTime}]`;
      enqueueSnackbar(notification, { variant: "info" });

      setOrderbookData((data) => updateOrderBookWithTrade(data, message));
    });

    newSocket.on("initial_map", ({ bids, asks }) => {
      setOrderbookData((data) => ({ ...data, bids, asks, dataLoaded: true }));
    });

    newSocket.on("identified", ({ token, user, cryptoPairs }) => {
      setIdentified(true);
      localStorage.setItem("token", token);

      setUser({ id: user.id, name: user.name });
      setCryptoPairs(cryptoPairs);
      enqueueSnackbar(`Welcome! ${user.name}`, { variant: "info" });
    });

    newSocket.on("identify_now", () => {
      const token = localStorage.getItem("token");

      if (token) {
        // Validate the token with the server here if necessary
        newSocket.emit("validate_token", token);
      } else {
        setAskForIdentification(true);
      }
    });

    newSocket.on("token_validation_failed", (message) => {
      localStorage.removeItem("token");
      enqueueSnackbar(`Token Identification Failed: ${message}`, {
        variant: "warning",
      });

      setIdentified(false);
      setAskForIdentification(true);
    });

    newSocket.on("identification_error", (message) => {
      localStorage.removeItem("token");
      enqueueSnackbar(`Identification Failed: ${message}`, {
        variant: "warning",
      });
    });

    newSocket.connect();

    return () => {
      newSocket.off("orderbook_new");
      newSocket.off("trade");
      newSocket.off("initial_map");
      newSocket.off("identified");
      newSocket.off("identify_now");
      newSocket.disconnect();
    };
  }, [SOCKET_URL, setOrderbookData]);

  const onSignIn = () => {
    setAskForIdentification(true);
  };

  const onSignOut = () => {
    socket.emit("signout");

    localStorage.removeItem("token");
    setIdentified(false);
    setCryptoPairs([]);
    setUser({});
    window.location.reload();
  };

  const onPairChange = (pairId) => {
    setSelectedPair(pairId);
    socket.emit("subscribe", pairId);
  };

  const onOrder = ({ price, quantity, type }) => {
    socket.emit("new_order", {
      pairId: selectedPair,
      price: Math.floor(Number.parseFloat(price) + 0.5),
      quantity,
      type,
    });
  };

  const value = {
    socket,
    user,
    onOrder,
    onPairChange,
    cryptoPairs,
    orderbookData,
    setOrderbookData,
    identified,
    setIdentified,
    askForIdentification,
    setAskForIdentification,
    onSignIn,
    onSignOut,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
