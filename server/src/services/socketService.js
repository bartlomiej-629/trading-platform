// Importing required Socket.IO module
const socketIo = require("socket.io"); // This should be provided if you're using socket.io as an external dependency
const axios = require("axios");
const jwt = require("jsonwebtoken");

const { getDataMap } = require("../utils/dataProcess");
const logger = require("../utils/logger");
const { TRADING_PLATFORM_URL } = require("../../config");

const JWT_SECRET = process.env.JWT_SECRET || "SECRET";

const mockUsers = require("../users.mock");
const { generateNewOrder } = require("./messageService");

// Initialize socketIO instance as null to later assign actual Socket.IO server instance
let ioInstance = null;

async function getOrderMap(pairId) {
  try {
    responseBids = await axios.get(
      `${TRADING_PLATFORM_URL}/bids?pairId=${pairId}`
    );
    responseAsks = await axios.get(
      `${TRADING_PLATFORM_URL}/asks?pairId=${pairId}`
    );

    bids = responseBids.data;
    asks = responseAsks.data;

    bids = getDataMap(bids);
    asks = getDataMap(asks);
    return { bids, asks };
  } catch (error) {}
}

function initializeSocket(server) {
  // Creating a socket.io instance attached to the server
  ioInstance = socketIo(server);

  // Connection event
  ioInstance.on("connect", (socket) => {
    logger.info(`Client connected: ${socket.id}`);

    // ask client to identify
    socket.emit("identify_now");

    socket.on("identify", async (name) => {
      const user = mockUsers.find((user) => user.name === name);

      if (user) {
        const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, {
          expiresIn: "1h",
        });
        socket.isIdentified = true;
        socket.name = user.name;
        try {
          responseCryptoPairs = await axios.get(
            `${TRADING_PLATFORM_URL}/cryptoPairs`
          );
          cryptoPairs = responseCryptoPairs.data;
          socket.emit("identified", { token, user, cryptoPairs });
        } catch (error) {
          logger.error(error.message);
        }
      } else {
        socket.emit("identification_error", "User not found");
      }
    });

    socket.on("signout", () => {
      socket.isIdentified = false;

      // leave rooms
      const rooms = socket.rooms;
      Object.keys(rooms).forEach((room) => {
        // The socket's own room has the same name as its ID
        if (room.toString() !== socket.id.toString()) {
          socket.leave(room);
        }
      });
    });

    socket.on("validate_token", async (token) => {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        socket.isIdentified = true;
        socket.name = decoded.name;

        try {
          responseCryptoPairs = await axios.get(
            `${TRADING_PLATFORM_URL}/cryptoPairs`
          );
          cryptoPairs = responseCryptoPairs.data;
          socket.emit("identified", { token, user: decoded, cryptoPairs });
        } catch (error) {
          logger.error(error.message);
        }
      } catch (error) {
        socket.isIdentified = false;
        socket.emit("token_validation_failed", "Invalid or expired token");
      }
    });

    // Example of handling a join room request from a client
    socket.on("subscribe", (pairId) => {
      // leave rooms
      for (let i = 1; i <= 5; i++) {
        if (i.toString() != pairId.toString()) {
          socket.leave(i);
        }
      }

      // join new room
      socket.join(pairId);

      logger.info(`Client ${socket.id} joined room: CRYPTO_PAIR-${pairId}`);
      getOrderMap(pairId).then((result) => {
        socket.emit("initial_map", result);
      });
    });

    socket.on("new_order", (order) => {
      if (!socket.isIdentified)
        socket.emit("token_validation_failed", "Please indentify yourself");

      generateNewOrder(order);
    });
  });

  logger.info("Socket.IO initialized and ready for connections.");
}

// Function to broadcast a message to all clients
function broadcast(event, message) {
  if (ioInstance) {
    ioInstance.emit(event, message);
  } else {
    logger.error("Socket.IO is not initialized.");
  }
}

// Function to broadcast a message to a specific room
function broadcastToRoom(roomName, event, message) {
  if (ioInstance) {
    ioInstance.to(roomName).emit(event, message);
  } else {
    logger.error("Socket.IO is not initialized.");
  }
}

// Export functions for external use
module.exports = { initializeSocket, broadcast, broadcastToRoom };
