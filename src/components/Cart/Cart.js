import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Image from "react-bootstrap/Image";
import { useDispatch } from "react-redux";
import {
  removeProduct,
  clearCart,
  decreaseProductQuantity,
  increaseProductQuantity,
} from "../../redux/actions/cartActions";

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
  },
};

export default function Cart({
  products,
  cartMethods,
  finished,
  disable,
  total,
}) {
  const dispatch = useDispatch();

  const clearRedux = () => {
    dispatch(clearCart());
  };
  const removeRedux = (id) => {
    dispatch(removeProduct(id));
  };
  const handleDecrease = (id) => {
    dispatch(decreaseProductQuantity(id));
  };
  const handleIncrease = (id) => {
    dispatch(increaseProductQuantity(id));
  };

  const productsInCart = products.map((item) => {
    return (
      <tr key={item.id}>
        <td>
          <Image style={styles.Image} src={item.image} rounded />
        </td>
        <td>{item.name}</td>
        <td>
          <div className="container-fluid d-flex justify-content-center align-items-center">
            {!finished && (
              <Button
                onClick={() => handleDecrease(item.id)}
                style={styles.SmallButton}
                disabled={disable}
              >
                -
              </Button>
            )}
            <p style={styles.Quantity}>{item.quantity}</p>
            {!finished && (
              <Button
                onClick={() => handleIncrease(item.id)}
                style={styles.SmallButton}
                disabled={disable}
              >
                +
              </Button>
            )}
          </div>
        </td>
        <td>${item.price}</td>
        <td>${item.price * item.quantity}</td>
        {!finished && (
          <td>
            <Button
              style={styles.SmallButton}
              onClick={() => removeRedux(item.id)}
              disabled={disable}
            >
              Borrar
            </Button>
          </td>
        )}
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
            <th>Precio unitario</th>
            <th>Precio total</th>
            {!finished && <th>Borrar producto</th>}
          </tr>
        </thead>
        <tbody>{productsInCart}</tbody>
        <tfoot>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td style={styles.Total}>Total:</td>
            <td style={styles.Total}>${total}</td>
            {!finished && (
              <td>
                <Button
                  style={styles.SmallButton}
                  onClick={() => clearRedux()}
                  disabled={disable}
                >
                  Vaciar Carrito
                </Button>
              </td>
            )}
          </tr>
        </tfoot>
      </Table>
    </div>
  );
}
