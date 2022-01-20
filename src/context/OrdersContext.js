import { useState, useEffect, useContext, createContext } from "react";
import { getFirestore } from "../firebase";

const OrdersContext = createContext();

export const useOrders = () => useContext(OrdersContext);

export const OrdersProvider = ({ children }) => {
  const [placedOrders, setPlacedOrders] = useState([]);

  useEffect(() => {
    const db = getFirestore();
    const itemCollection = db.collection("orders");
    itemCollection
      .get()
      .then((data) => {
        setPlacedOrders(data.docs.map((item) => {return {id: item.id, details: item.data()}}));
      })
      .catch((error) => console.log(error));
  }, []);

  const getUserOrders = (userEmail) => {
    return placedOrders.filter(item=>item.details.buyer.email === userEmail);
  };

  const getOrderById = (id) => {
    return placedOrders.find(item=>item.id === id);
  }

  return (
    <OrdersContext.Provider
      value={{
        getUserOrders,
        getOrderById,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};
