import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

import { combineReducers } from "redux";
import cartReducer from "./reducers/cartReducers";
import orderReducer from "./reducers/orderReducers";

const rootReducer = combineReducers({
  cart: cartReducer,
  order: orderReducer,
});

const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store;
