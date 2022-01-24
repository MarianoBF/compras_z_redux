import { combineReducers } from "redux";

const initialState = {
  allProducts: [],
  cartProducts: [],
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_PRODUCT":
      const retrieveProduct = state.allProducts.filter(
        (item) => item.id === action.payload.id
      );
      return {
        ...state,
        cartProducts: [
          ...state.cartProducts,
          {
            quantity: action.payload.quantity,
            id: action.payload.id,
            name: retrieveProduct[0].name,
            price: retrieveProduct[0].price,
            stock: retrieveProduct[0].stock,
            image: retrieveProduct[0].image,
          },
        ].sort((a, b) => (a.name > b.name ? 1 : -1)),
      };
    case "REMOVE_PRODUCT":
      return {
        ...state,
        cartProducts: [
          ...state.cartProducts.filter((item) => item.id !== action.payload.id),
        ],
      };
    case "CLEAR_PRODUCTS":
      return initialState;
    case "GET_INITIAL_PRODUCTS":
      return {
        ...state,
        allProducts: [...action.payload],
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  cart: cartReducer,
});

export default rootReducer;
