const ORDER_TYPES = {
  ASKS: "asks",
  BIDS: "bids",
};

const ORDER_ACTION_TYPES = {
  NEW: "new",
  MODIFY: "modify",
  CANCEL: "cancel",
};

const CRYPTO_BASE_INFO = [
  {
    name: "BTC-USD",
    price: 100,
    range: 10,
  },
  {
    price: 100,
    range: 10,
  },
  {
    price: 1000,
    range: 100,
  },
  {
    price: 100,
    range: 10,
  },
  {
    price: 100,
    range: 10,
  },
];

module.exports = { ORDER_TYPES, ORDER_ACTION_TYPES, CRYPTO_BASE_INFO };
