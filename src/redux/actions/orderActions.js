function createOrder(order) {
  return {
    type: "CREATE_ORDER",
    payload: { order },
  };
}

export {
    createOrder,
  };
  