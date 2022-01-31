import { fetchProducts } from "./productActions";
import { getFirestore } from "../../firebase";
import { store } from "../store";

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

function setOrder_id(order_id) {
  return {
    type: "SAVE_ORDER_ID",
    payload: { order_id },
  };
}

function updateStockChecked(status) {
  return {
    type: "UPDATE_STOCK_CHECK",
    payload: { status },
  };
}

const checkStock = () => {
  return (dispatch) => {
    dispatch(fetchProducts());

    let allProducts = store.getState().cart.allProducts;
    let cartProducts = store.getState().cart.cartProducts;
    let stockError = [];

    cartProducts.forEach((item) => {
      const filtered = allProducts.filter((all) => all.id === item.id)[0];
      const alreadyAccountedFor = stockError.filter(
        (errorItem) => errorItem.id === item.id
      );
      if (alreadyAccountedFor.length === 0) {
        const othersInCart = cartProducts.filter(
          (cartItem) => cartItem.id === item.id
        );
        if (othersInCart.length > 1) {
          const totalQuantity = othersInCart.reduce(
            (acc, curr) => acc + curr.quantity,
            0
          );
          if (filtered.stock < totalQuantity) {
            stockError.push({
              id: item.id,
              name: item.name,
              stock: filtered.stock,
              type: "tooMuch",
            });
          } else if (totalQuantity < 1) {
            stockError.push({
              id: item.id,
              name: item.name,
              stock: filtered.stock,
              type: "tooFew",
            });
          }
        } else {
          if (filtered.stock < item.quantity) {
            stockError.push({
              id: item.id,
              name: item.name,
              stock: filtered.stock,
              type: "tooMuch",
            });
          } else if (item.quantity < 1) {
            stockError.push({
              id: item.id,
              name: item.name,
              stock: filtered.stock,
              type: "tooFew",
            });
          }
        }
      }
    });
    if (stockError.length > 0) {
      dispatch(updateStockChecked(stockError));
    } else {
      dispatch(updateStockChecked("OK"));
    }
  };
};

const createOrder = (order_details) => {
  return (dispatch) => {
    let cartProducts = store.getState().cart.cartProducts;
    const priceReducer = (prev, cur) => prev + cur.quantity * cur.price;
    const orderedProducts = cartProducts.map((item) => ({
      id: item.id,
      title: item.name,
      price: item.price,
      quantity: item.quantity,
      stock: item.stock,
    }));
    const order = {
      buyer: {
        name: order_details.name,
        phone: order_details.phone,
        email: order_details.email,
        address: order_details.address,
        comments: order_details.comments,
      },
      items: [...orderedProducts],
      date: new Date(),
      total: cartProducts.reduce(priceReducer, 0),
    };

    getFirestore()
      .collection("orders")
      .add(order)
      .then((res) => {
        dispatch(setOrder_id(res.id));
        cartProducts.forEach((item) =>
          getFirestore()
            .collection("products")
            .doc(String(item.id))
            .update({ stock: item.stock - item.quantity })
        );
      })
      .catch((error) => {
        console.log(error);
        return error;
      });

    dispatch(fetchProducts());
  };
};

export {
  addProduct,
  removeProduct,
  clearCart,
  checkStock,
  createOrder,
  getInitialProductsCart,
  increaseProductQuantity,
  decreaseProductQuantity,
};
