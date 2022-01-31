import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";

import { combineReducers } from "redux";
import cartReducer from "./reducers/cartReducer";
import productsReducer from "./reducers/productsReducer";

const rootReducer = combineReducers({
  cart: cartReducer,
  products: productsReducer,
});

const persistConfig = {
  key: "compras_z_persist",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(
  persistedReducer,
  compose(
    applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);
export const persistor = persistStore(store);
