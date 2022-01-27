import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

import { combineReducers } from "redux";
import cartReducer from "./reducers/cartReducer";
import orderReducer from "./reducers/orderReducer";
import productsReducer from "./reducers/productsReducer";

const rootReducer = combineReducers({
  cart: cartReducer,
  order: orderReducer,
  products: productsReducer
});

const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store;
