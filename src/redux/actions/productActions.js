import { getFirestore } from "../../firebase";

import { getInitialProductsCart } from "./cartActions";

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
          dispatch(
            getInitialProductsCart(data.docs.map((item) => item.data()))
          );
        })
        .catch((error) => console.log(error));
    } catch (error) {
      console.log(error);
    }
  };
};

export { fetchProducts };
