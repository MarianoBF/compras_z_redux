import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useOrders } from "../../context/OrdersContext";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";

export default function OrdersDetails({ email }) {
  const { id_order } = useParams();
  const orders = useOrders();
  const [order, setOrder] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const retrievedOrder = orders.getOrderById(id_order);
    if (retrievedOrder) {
      setOrder(retrievedOrder);
      setIsLoading(false);
    }
  }, [id_order, orders]);

  const styles = {
    Container: {
      display: "flex",
      justifyContent: "center",
      marginTop: "2em",
    },
    Card: {
      justifyContent: "center",
      textAlign: "center",
      alignItems: "center",
      maxWidth: "700px",
      maxHeight: "1200px",
    },
    CardBody: {
      margin: "auto",
    },
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: "center" }}>
        <h2>Buscando la orden...</h2>
        <Spinner animation="border" />
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ textAlign: "center" }}>
        <h2>No se encuentra la orden</h2>
      </div>
    );
  }

  return (
    <Container style={styles.Container}>
      <Card style={styles.Card}>
        <Card.Body style={styles.CardBody}>
          <Card.Title>Orden: {order.id}</Card.Title>
          {email === order.details.buyer.email ? (
            <>
              <Card.Text>{order.details.buyer.name}</Card.Text>
              <Card.Text>{order.details.buyer.phone}</Card.Text>
              <Card.Text>{order.details.buyer.address}</Card.Text>
              <Card.Text>{order.details.buyer.email}</Card.Text>
              <Card.Text>{order.details.buyer.comments}</Card.Text>
            </>
          ) : (
            <Card.Text>
              Para ver los datos personales necesita estar logueado con el mismo
              email que realizó la compra
            </Card.Text>
          )}
          <Card.Text>Monto total: $ {order.details.total}</Card.Text>
          <hr />
          <Card.Text>Items: </Card.Text>
          {order.details.items.map((item) => (
            <Card.Text key={item.id + item.option}>
              {item.title} {item.option.name} {item.option.value} -{" "}
              {item.quantity} unidades
            </Card.Text>
          ))}
        </Card.Body>
        <Card.Footer></Card.Footer>
      </Card>
    </Container>
  );
}
