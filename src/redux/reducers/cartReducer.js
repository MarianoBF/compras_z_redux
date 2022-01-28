import { getFirestore } from "../../firebase";

const initialState = {
  allProducts: [],
  cartProducts: [],
  order: {}
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
    case "INCREASE_PRODUCT_QUANTITY":
      const prodToIncrease = state.cartProducts.findIndex(
        (item) => +item.id === +action.payload.id
      );
      const increasedProds = [...state.cartProducts];
      if (increasedProds[prodToIncrease].stock > increasedProds[prodToIncrease].quantity) increasedProds[prodToIncrease].quantity++ ;
      return {
        ...state,
        cartProducts: [...increasedProds],
      };
    case "DECREASE_PRODUCT_QUANTITY":
      const prodToDecrease = state.cartProducts.findIndex(
        (item) => +item.id === +action.payload.id
      );
      const decreasedProds = [...state.cartProducts];
      if (decreasedProds[prodToDecrease].quantity > 1) decreasedProds[prodToDecrease].quantity-- ;
      return {
        ...state,
        cartProducts: [...decreasedProds],
      };
    case "CLEAR_PRODUCTS":
      return initialState;
      case "CREATE_ORDER":
        let order_id;
        getFirestore()
          .collection("orders")
          .add(action.payload.order)
          .then((res) => {
            order_id = res.id;
            action.payload.order.items.forEach((item) =>
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
        return {
          order: { id: order_id },
        };
    case "GET_INITIAL_PRODUCTS_CART":
      return {
        ...state,
        allProducts: [...action.payload],
      };
    default:
      return state;
  }
};

export default cartReducer;
