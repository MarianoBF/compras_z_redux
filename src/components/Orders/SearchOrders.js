import { useState } from "react";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { getFirestore } from "../../firebase";


export default function SearchOrders() {
  const [searchOrder, setSearchOrder] = useState();
  const [order, setOrder] = useState();

  const handleInput = (e) => {
    setSearchOrder(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const db = getFirestore();
    const itemCollection = db.collection("orders").doc(searchOrder);
    itemCollection
      .get()
      .then((data) => {
        setOrder(data.data());
      })
      .catch((error) => console.log(error));
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
        <Link to={"/orders/" + searchOrder}>
          Se encontró la orden {searchOrder} del día{" "}
          {new Date(order.date.seconds * 1000)
            .toISOString()
            .slice(0, 10)}
          , clickeá para ver los detalles
        </Link>
      )}
    </div>
  );
}
