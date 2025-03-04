// Function to update the state with new data
function updateOrderBookWithNewOrder(state, newData) {
  let newState;
  try {
    newState = JSON.parse(JSON.stringify(state));
  } catch (error) {
    return;
  }
  let orderBookType = newData.type; // "bids" or "asks"
  let existingOrders = newState[orderBookType];
  let orderIndex = existingOrders.findIndex(
    (order) => order.price === newData.price
  );

  if (orderIndex !== -1) {
    // If the price exists, update the quantity
    existingOrders[orderIndex].quantity += newData.quantity;
    existingOrders[orderIndex].count++;
  } else {
    // If the price does not exist, add the new order
    existingOrders.push({
      quantity: newData.quantity,
      price: newData.price,
      count: 1,
    });
    // After adding the new order, sort the array to maintain order
    existingOrders.sort((a, b) =>
      orderBookType === "bids" ? b.price - a.price : a.price - b.price
    );
  }
  return newState;
}

function updateOrderBookWithTrade(state, message) {
  let newState;
  try {
    // Clone the state to avoid modifying the original state
    newState = JSON.parse(JSON.stringify(state));
  } catch (error) {
    return;
  }

  // Helper function to update a specific order book (asks or bids)
  function updateOrderType(orderType) {
    const index = newState[orderType].findIndex(
      (order) => order.price === message.price
    );
    if (index !== -1) {
      newState[orderType][index].quantity -= message.quantity;
      newState[orderType][index].count -= 1;
      if (newState[orderType][index].quantity <= 0) {
        newState[orderType].splice(index, 1); // Remove the order if quantity is 0 or negative
      }
    }
  }

  // Update both asks and bids
  updateOrderType("asks");
  updateOrderType("bids");

  return newState;
}

exports.updateOrderBookWithNewOrder = updateOrderBookWithNewOrder;
exports.updateOrderBookWithTrade = updateOrderBookWithTrade;
