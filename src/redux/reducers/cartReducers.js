import { combineReducers } from "redux";

const cartReducer = (state = [], action) => {
  switch (action.type) {
    case "LIST_PRODUCTS":
      return state;
    case "ADD_PRODUCT":
      return [
        ...state,
        { quantity: action.payload.quantity, id: action.payload.id },
      ];
    case "REMOVE_PRODUCT":
      return [...state.filter(item=>item.id !== action.payload.id)];
    case "CLEAR_PRODUCTS":
        return [];
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  cart: cartReducer,
});

export default rootReducer;
