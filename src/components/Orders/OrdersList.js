import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";

export default function OrdersList({ orders }) {
  const orderTable = orders.map((order) => {
    return (
      <tr key={order.details.date.seconds + order.details.date.nanoseconds}>
        <td>{order.id}</td>
        <td>{order.details.buyer.name}</td>
        <td>
          {new Date(order.details.date.seconds * 1000)
            .toISOString()
            .slice(0, 10)}
        </td>
        <td>$ {order.details.total}</td>
        <td>
          {" "}
          <Link to={"/orders/" + order.id}>Ver detalle del pedido</Link>
        </td>
      </tr>
    );
  });

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Fecha</th>
          <th>Monto Total</th>
          <th>Ver más</th>
        </tr>
      </thead>
      <tbody>{orderTable}</tbody>
    </Table>
  );
}
