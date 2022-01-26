import { getFirestore } from "../../firebase";
import { useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import useMounted from "../../hooks/useMounted";
import OrdersList from "./OrdersList";

export default function ItemListContainer({ email }) {
  const [orderList, setOrderList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMounted = useMounted();
  const [noOrders, setNoOrders] = useState(false);


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

      if (placedOrders.length > 0 && isMounted) {
      setNoOrders(false);
      setOrderList(placedOrders.filter(item=>item.details.buyer.email === email));
      setIsLoading(false);
    } else {
      setIsLoading(false);
      setNoOrders(true);
    }
  }, [email, isMounted, placedOrders]);

  if (!email) {
    return (
      <div style={{ textAlign: "center" }}>
        <h2>No se encuentra logueado, debe loguearse</h2>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{ textAlign: "center" }}>
        <h2>Trayendo información de las órdenes...</h2>
        <Spinner animation="border" />
      </div>
    );
  }

  if (noOrders) {
    return (
      <div style={{ textAlign: "center" }}>
        <h2>Aún no hay pedidos para este usuario</h2>
      </div>
    );
  }



  return (
    <>
      <h1 className="mainTitle">Listado de órdenes para el correo {email}</h1>
      <OrdersList orders={orderList} />
    </>
  );
}
