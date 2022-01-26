import { getFirestore } from "../../firebase";

const initialState = {
  order: {},
};

const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CREATE_ORDER":
      let order_id;
      getFirestore()
        .collection("orders")
        .add(action.payload.order)
        .then((res) => {
          order_id = res.id;
        })
        .catch((error) => {
          console.log(error);
          return error;
        });
      return {
        order: { id: order_id },
      };
    default:
      return state;
  }
};

export default orderReducer;

// const saveOrder = (order) => {
//     getFirestore()
//       .collection("orders")
//       .add(order)
//       .then((res) => {
//         order.items.forEach((item) =>
//           getFirestore()
//             .collection("products")
//             .doc(String(item.id))
//             .update({ stock: item.stock - item.quantity })
//         );
//         setOrderID(res.id);
//         setTimeout(() => {
//           sendOrderMail(order, res.id);
//           clearFromLocalStorage();
//         }, 500);
//       })
//       .catch((error) => {
//         console.log(error);
//         return error;
//       });
//   };
