const amqp = require("amqplib");
const { v4: uuid } = require("uuid");

const { ORDER_TYPES, ORDER_ACTION_TYPES } = require("../../const");
const { generatePriceQuantity } = require("../utils/dataProcess");

let channel = null;

async function connectRabbitMQ() {
  const connection = await amqp.connect("amqp://localhost");
  channel = await connection.createChannel();

  await channel.assertQueue("orders");
  await channel.assertQueue("trades");

  startOrderGenerator();
  startTradingGenerator();
  return channel;
}

function generateNewOrder({ pairId, price, quantity, type }) {
  const newOrder = {
    id: uuid(),
    pairId: Number.parseInt(pairId),
    type: type === "buy" ? ORDER_TYPES.BIDS : ORDER_TYPES.ASKS,
    price: Number.parseFloat(price),
    quantity: Number.parseFloat(quantity),
    actionType: ORDER_ACTION_TYPES.NEW,
    timeStamp: new Date(),
  };
  channel.sendToQueue("orders", Buffer.from(JSON.stringify(newOrder)));
}

function startOrderGenerator() {
  // Random order generator setup
  const intervalId = setInterval(() => {
    // Decide randomly what order and action to perform
    const orderType = Math.floor(Math.random() * 2); // 0: ask, 1: bid
    const orderActionType = Math.floor(Math.random() * 10); // 0-7: new, 8: modify, 9: cancel order

    const order = orderType ? ORDER_TYPES.ASKS : ORDER_TYPES.BIDS;
    const action =
      orderActionType === 8
        ? ORDER_ACTION_TYPES.MODIFY
        : orderActionType === 9
        ? ORDER_ACTION_TYPES.CANCEL
        : ORDER_ACTION_TYPES.NEW;

    // Send a new order
    const newOrder = {
      id: uuid(),
      pairId: Math.ceil(Math.random() * 5),
      type: order,
      actionType: action,
      timeStamp: new Date(),
    };

    if (newOrder.actionType === ORDER_ACTION_TYPES.NEW) {
      item = generatePriceQuantity(newOrder.pairId, newOrder.type);
      newOrder.price = item.price;
      newOrder.quantity = item.quantity;
    }
    // give existing id for update or cancel
    else {
      newOrder.id = Math.ceil(Math.random() * 100);
    }

    if (action === ORDER_ACTION_TYPES.CANCEL) {
      delete newOrder.price;
      delete newOrder.quantity;
      delete newOrder.pairId;
    }
    channel.sendToQueue("orders", Buffer.from(JSON.stringify(newOrder)));
  }, process.env.ORDERBOOK_GENERATION_TIME); // Generate a new action every 0.3 seconds
}

function startTradingGenerator() {
  // Random trade generator setup
  setInterval(() => {
    const pairId = Math.ceil(Math.random() * 5);
    const { price, quantity } = generatePriceQuantity(pairId);
    // Send a new trade
    const newTrade = {
      id: uuid(),
      pairId,
      price,
      quantity,
      timeStamp: new Date(),
    };

    channel.sendToQueue("trades", Buffer.from(JSON.stringify(newTrade)));
  }, process.env.TRADE_GENERATION_TIME); // Generate a new action every 0.5 seconds
}

module.exports = { connectRabbitMQ, generateNewOrder };
