import { getFirestore } from "../../firebase";

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

function getInitialProducts(products) {
  return {
    type: "GET_INITIAL_PRODUCTS",
    payload: products,
  };
}

const fetchProducts = () => {
  return (dispatch) => {
    try {
      const db = getFirestore();
      const itemCollection = db.collection("products");
      itemCollection
        .get()
        .then((data) => {
          dispatch(getInitialProducts(data.docs.map((item) => item.data())));
        })
        .catch((error) => console.log(error));
    } catch (error) {
      console.log(error);
    }
  };
};

export { addProduct, removeProduct, clearCart, fetchProducts, increaseProductQuantity, decreaseProductQuantity };
