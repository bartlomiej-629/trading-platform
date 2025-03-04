require("dotenv").config();
const express = require("express");
const http = require("http");

const { connectRabbitMQ } = require("./src/services/messageService");
const { initializeSocket } = require("./src/services/socketService");
const connectAndConsume = require("./src/services/messageConsumer");

const logger = require("./src/utils/logger");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

server.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
  // Initialize WebSocket
  initializeSocket(server);

  // connect to RabbitMQ for trading actions
  connectRabbitMQ()
    .then(() =>
      logger.info("Connected to RabbitMQ for sending order & trade actions")
    )
    .catch((err) => logger.error("RabbitMQ connection error:", err));

  // connect to RabbitMQ for consuming trading actions
  connectAndConsume()
    .then(() => logger.info("Ready for consuming actions"))
    .catch((err) => logger.error("RabbitMQ connection error:", err));
});
