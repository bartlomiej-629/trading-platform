const { CRYPTO_BASE_INFO } = require("../../const");

function getDataMap(orders) {
  const orderMap = new Map();

  // Going through each order and grouping by price
  orders.forEach((order) => {
    if (orderMap.has(order.price)) {
      // If the price is already present in the map, add the quantity of the current order to the existing quantity
      let existingOrder = orderMap.get(order.price);
      existingOrder.quantity += order.quantity;
      existingOrder.count++;
      orderMap.set(order.price, existingOrder);
    } else {
      // If the price is not yet present in the map, add the whole order to the map
      orderMap.set(order.price, {
        quantity: order.quantity,
        price: order.price,
        count: 1,
      });
    }
  });

  // Convert Map to an array of order objects
  return Array.from(orderMap.values()).sort((a, b) => a.price - b.price);
}

function generatePriceQuantity(pairId, type) {
  const basePrice = CRYPTO_BASE_INFO[pairId - 1].price; // Assuming basePrice is 100
  const priceRange = CRYPTO_BASE_INFO[pairId - 1].range + 2; // Assuming priceRange is 10

  function getExtremeWeightedPrice(base, range, isAsk) {
    let rnd = Math.random(); // Generate a random number between 0 and 1
    let weight = Math.pow(rnd, 2); // Square the random number to skew the distribution towards the extremes

    // Adjust weight to avoid the base price for asks and bids
    if (isAsk) {
      weight = 1 - weight; // Invert the weight for asks to favor higher prices
    }

    // Calculate the price offset from the base price
    let offset = Math.floor(range * weight);

    // For asks, add the offset to the base price, ensuring it's at least base
    // For bids, subtract the offset from the base price, ensuring it's at most base
    let price = isAsk ? base + offset : base - (range - offset) + 1;

    // Ensure price does not exceed the range boundaries
    if (isAsk) {
      price = Math.min(price, base + range);
    } else {
      price = Math.max(price, base - range);
    }

    return price;
  }

  let price;
  if (type === "asks") {
    price = getExtremeWeightedPrice(basePrice, priceRange, true);
  } else if (type === "bids") {
    price = getExtremeWeightedPrice(basePrice, priceRange, false);
  } else {
    // If type is not specified, randomly choose between bid and ask
    let isAsk = Math.random() < 0.5;
    price = getExtremeWeightedPrice(basePrice, priceRange, isAsk);
  }

  return {
    price: parseFloat(price.toFixed(0)), // No need to round since prices are integers
    quantity: Math.random() * 3 + 1, // Ensuring at least one unit sold
  };
}
module.exports = {
  getDataMap,
  generatePriceQuantity,
};
