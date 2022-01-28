import { getFirestore } from "../../firebase";

const initialState = {
  allProducts: [],
  cartProducts: [],
  order: {},
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
      if (
        increasedProds[prodToIncrease].stock >
        increasedProds[prodToIncrease].quantity
      )
        increasedProds[prodToIncrease].quantity++;
      return {
        ...state,
        cartProducts: [...increasedProds],
      };
    case "DECREASE_PRODUCT_QUANTITY":
      const prodToDecrease = state.cartProducts.findIndex(
        (item) => +item.id === +action.payload.id
      );
      const decreasedProds = [...state.cartProducts];
      if (decreasedProds[prodToDecrease].quantity > 1)
        decreasedProds[prodToDecrease].quantity--;
      return {
        ...state,
        cartProducts: [...decreasedProds],
      };
    case "CLEAR_PRODUCTS":
      return initialState;
    case "CREATE_ORDER":
      let order_id;
      let stockError = [];
      state.cartProducts.forEach((item) => {
        const filtered = state.allProducts.filter(
          (all) => all.id === item.id
        )[0];
        const alreadyAccountedFor = stockError.filter(
          (errorItem) => errorItem.id === item.id
        );
        if (alreadyAccountedFor.length === 0) {
          const othersInCart = state.cartProducts.filter(
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
        return stockError;
      } else {
        const priceReducer = (prev, cur) => prev + cur.quantity * cur.price;
        const orderedProducts = state.cartProducts.map((item) => ({
          id: item.id,
          title: item.name,
          price: item.price,
          quantity: item.quantity,
          stock: item.stock,
        }));
        const order = {
          buyer: {
            name: action.payload.order.name,
            phone: action.payload.order.phone,
            email: action.payload.order.email,
            address: action.payload.order.address,
            comments: action.payload.order.comments,
          },
          items: [...orderedProducts],
          date: new Date(),
          total: state.cartProducts.reduce(priceReducer, 0),
        };

        getFirestore()
          .collection("orders")
          .add(order)
          .then((res) => {
            order_id = res.id;
            state.cartProducts.forEach((item) =>
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
        return { ...state, order: { id: order_id } };
      }
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
