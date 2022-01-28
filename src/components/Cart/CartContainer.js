import Button from "react-bootstrap/Button";
import Cart from "./Cart";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import BuyForm from "./BuyForm";
import Alert from "react-bootstrap/Alert";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { createOrder, clearCart } from "../../redux/actions/cartActions";

export default function CartContainer({ user }) {
  const history = useHistory();
  const [finishedOrder, setFinishedOrder] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [checkingStock, setCheckingStock] = useState(false);
  const [stockError, setStockError] = useState(false);
  const [stockErrorMessage, setStockErrorMessage] = useState([]);
  const [disable, setDisable] = useState(false);

  const productsToShow = useSelector((state) => state.cart.cartProducts);

  const priceReducer = (prev, cur) => prev + cur.quantity * cur.price;
  const total = useSelector((state) => state.cart.cartProducts).reduce(
    priceReducer,
    0
  );

  const order_id = useSelector((state) => state.cart.order_id);

  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      if (finishedOrder) {
        dispatch(clearCart());
        setFinishedOrder(false);
      }
    };
    // eslint-disable-next-line
  }, [finishedOrder]);

  if (productsToShow?.length === 0) {
    return (
      <div className="centered">
        <h1>Aún no hay productos en el carrito</h1>
        <Link to={"/"}>
          <Button>Volver y agregar productos</Button>
        </Link>
      </div>
    );
  }

  const handleCloseAlert = () => {
    setFinishedOrder(false);
    dispatch(clearCart());
    history.push("/");
  };

  const handleShowForm = () => {
    setDisable(false);
    setStockError(false);
    setCheckingStock(true);
    setTimeout(() => {
      const stock = "OK"
      if (stock === "OK") {
        setShowForm(true);
        setCheckingStock(false);
      } else {
        setCheckingStock(false);
        setStockError(true);
        setStockErrorMessage(stock);
      }
    }, 2000);
  };

  const handleReturn = () => {
    setDisable(true);
    setShowForm(false);
  };

  const handleCancel = () => {
    setDisable(true);
    setShowForm(false);
    dispatch(clearCart());
    history.push("/");
  };

  const handleSubmit = (values) => {
    setDisable(true);
    dispatch(createOrder(values));
    setFinishedOrder(true);
    setShowForm(false);
  };

  return (
    <div className="centered">
      <Alert show={finishedOrder} variant="success">
        <p>
          Se ha realizado tu pedido exitosamente {user.name}. El número de
          registro del pedido es: {order_id}
        </p>
        <p>
          Recibirás un correo electrónico confirmando la fecha de entrega e
          instrucciones para el pago.
        </p>
        <div>
          <Button onClick={handleCloseAlert} className="closeBtn">
            Cerrar aviso y volver al menú principal
          </Button>
        </div>
      </Alert>
      {!showForm && (
        <>
          {" "}
          <Cart
            total={total}
            products={productsToShow}
            finished={finishedOrder}
            disable={checkingStock}
          />
          <hr />
          {!finishedOrder && user.name && (
            <>
              <Button
                onClick={handleShowForm}
                className="closeBtn"
                disabled={checkingStock}
              >
                Completar mis datos y confirmar compra
              </Button>
              <Alert show={checkingStock} variant="success">
                <p>Chequeando stock...</p>
              </Alert>
              <Alert show={stockError} variant="danger">
                <p>Se encontró un problema con el stock:</p>
                {stockErrorMessage.map((item) => {
                  return (item.type = "tooMuch" ? (
                    <p>
                      El artículo {item.name} tiene {item.stock} cantidades
                      disponibles
                    </p>
                  ) : (
                    <p> Debe pedir al menos una unidad de {item.name} </p>
                  ));
                })}
                <p>
                  Esto puede deberse a que se modificó el stock disponible
                  mientras realizabas la compra, en caso de que persista este
                  mensaje por favor contactanos
                </p>
                <p>
                  Por favor, ajustá tu pedido y volvé a presionar Confirmar
                  compra{" "}
                </p>
              </Alert>

              <p>
                En el siguiente paso podrás detallar los datos para el envío.
                Realizarás la compra a nombre de {user.name}
              </p>
            </>
          )}
          {!finishedOrder && !user.name && (
            <div className="loginRequired">
              <p>
                Necesitás loguearte desde la barra superior para completar una
                compra.
              </p>
            </div>
          )}
        </>
      )}

      {!finishedOrder && showForm && (
        <BuyForm
          handleSubmitForm={handleSubmit}
          handleCancel={handleCancel}
          handleReturn={handleReturn}
          user={user}
          disable={disable}
        />
      )}
    </div>
  );
}
