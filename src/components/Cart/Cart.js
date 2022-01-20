import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Image from "react-bootstrap/Image";

const styles = {
  Image: {
    maxHeight: "50px",
    width: "70px",
    objectFit: "contain",
    margin: "2px auto",
  },
  Table: {
    textAlign: "center",
    verticalAlign: "middle",
  },
  Total: {
    background: "lightblue",
    fontSize: "1.3rem",
    fontWeigth: "bold",
  },
  SmallButton: {
    fontSize: "0.8rem",
  },
  ItemCount: {
    display: "flex",
    flexWrap: "no-wrap",
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
  },
  Quantity: {
    margin: "0 10px",
  }
};

export default function Cart({products, cartMethods, finished, disable}) {

  const {remove, clear, total, increaseQuantity, decreaseQuantity} =
    cartMethods;

  const productsInCart = products.map(item => {
    return (
      <tr key={item?.option?.value?item.id+item.option.value:item.id}>
        <td>
          <Image style={styles.Image} src={item.image} rounded />
        </td>
        <td>{item.name}</td>
        <td>
        <div className="container-fluid d-flex justify-content-center align-items-center">
        {!finished&&
          <Button
            onClick={() => decreaseQuantity(item.id, item?.option)}
            style={styles.SmallButton} disabled={disable}>
            -
          </Button>}
          <p style={styles.Quantity}>{item.quantity}</p>{!finished&&
          <Button
            onClick={() => increaseQuantity(item.id, item?.option)}
            style={styles.SmallButton} disabled={disable}>
            +
          </Button>}
          </div>
        </td>
        <td>{item.option.name ? item.option.name + ": " + item.option.value : "N/A" }</td>
        <td>${item.price}</td>
        <td>${item.price * item.quantity}</td>
        {!finished&&<td>
          <Button style={styles.SmallButton} onClick={() => remove(item.id, item?.option)} disabled={disable}>
            Borrar
          </Button>
        </td>}
      </tr>
    );
  });

  return (
    <div>
      <h2>
        {finished
          ? "Este es el detalle de la orden que realizó"
          : "Productos en el carrito"}
      </h2>

      <Table striped bordered hover responsive style={styles.Table}>
        <thead>
          <tr>
            <th></th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Opción</th>
            <th>Precio unitario</th>
            <th>Precio total</th>
            {!finished&&<th>Borrar producto</th>}
          </tr>
        </thead>
        <tbody>{productsInCart}</tbody>
        <tfoot>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td style={styles.Total}>Total:</td>
            <td style={styles.Total}>${total()}</td>
            {!finished&&<td>
              <Button style={styles.SmallButton} onClick={clear} disabled={disable}>
                Vaciar Carrito
              </Button>
            </td>}
          </tr>
        </tfoot>
      </Table>
    </div>
  );
}
