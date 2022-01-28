import { fetchProducts } from "./productActions";

function addProduct(quantity, id) {
  return {
    type: "ADD_PRODUCT",
    payload: { quantity, id },
  };
}

function removeProduct(id) {
  return {
    type: "REMOVE_PRODUCT",
    payload: { id },
  };
}

function increaseProductQuantity(id) {
  return {
    type: "INCREASE_PRODUCT_QUANTITY",
    payload: { id },
  };
}

function decreaseProductQuantity(id) {
  return {
    type: "DECREASE_PRODUCT_QUANTITY",
    payload: { id },
  };
}

function clearCart() {
  return {
    type: "CLEAR_PRODUCTS",
  };
}

function getInitialProductsCart(products) {
  return {
    type: "GET_INITIAL_PRODUCTS_CART",
    payload: products,
  };
}

function submitCreateOrder(order) {
  return {
    type: "CREATE_ORDER",
    payload: { order },
  };
}

const createOrder = (order) => {
  return (dispatch) => {
          dispatch(submitCreateOrder(order));
          dispatch(
            fetchProducts()
          );
        }
};

export {
  addProduct,
  removeProduct,
  clearCart,
  createOrder,
  getInitialProductsCart,
  increaseProductQuantity,
  decreaseProductQuantity,
};
