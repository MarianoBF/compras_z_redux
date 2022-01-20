import { combineReducers } from "redux";


const cartReducer = (state = [], action) => {
    switch (action.type) {
        case "ADD_PRODUCT":
            return [...state, { text: action.payload.text }]
        default: return state
    }
}


const rootReducer = combineReducers({
    cart: cartReducer
});

export default rootReducer;
