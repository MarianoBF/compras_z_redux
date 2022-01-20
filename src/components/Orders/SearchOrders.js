import { useState } from "react";
import { useOrders } from "../../context/OrdersContext";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function SearchOrders() {
  const orders = useOrders();
  const [searchOrder, setSearchOrder] = useState();
  const [order, setOrder] = useState();

  const handleInput = (e) => {
    setSearchOrder(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setOrder(orders.getOrderById(searchOrder));
  };

  return (
    <div>
      <Form onSubmit={handleSearch}>
        <Form.Group className="mb-3">
          <Form.Label>Buscar orden:</Form.Label>
          <Form.Control type="text" onChange={handleInput} />
        </Form.Group>
        <Button type="submit">Buscar</Button>
      </Form>
      {order && (
        <Link to={"/orders/" + order.id}>
          Se encontró la orden {order.id} del día{" "}
          {new Date(order.details.date.seconds * 1000)
            .toISOString()
            .slice(0, 10)}
          , clickeá para ver los detalles
        </Link>
      )}
    </div>
  );
}
