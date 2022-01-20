import { useCart } from "../../context/CartContext";
import Button from "react-bootstrap/Button";
import Cart from "./Cart";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import BuyForm from "./BuyForm";
import Alert from "react-bootstrap/Alert";
import { Link } from "react-router-dom";

export default function CartContainer({ user }) {
  const cart = useCart();
  const history = useHistory();
  const [finishedOrder, setFinishedOrder] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [checkingStock, setCheckingStock] = useState(false);
  const [stockError, setStockError] = useState(false);
  const [stockErrorMessage, setStockErrorMessage] = useState([]);
  const [disable, setDisable] = useState(false);

  useEffect(() => {
    return () => {
      if (finishedOrder) {
        cart.clear();
        setFinishedOrder(false);
      }
    };
    // eslint-disable-next-line
  }, [finishedOrder]);

  if (cart.cartProducts?.length === 0) {
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
    cart.clear();
    history.push("/");
  };

  const handleShowForm = () => {
    setDisable(false);
    setStockError(false);
    setCheckingStock(true);
    setTimeout(() => {
      const stock = cart.checkStock();
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
    cart.clear();
    history.push("/");
  };

  const handleSubmit = (values) => {
    setDisable(true);
    const orderedProducts = cart.cartProducts.map((item) => ({
      id: item.id,
      title: item.name,
      price: item.price,
      quantity: item.quantity,
      stock: item.stock,
      option: item.option.name ? item.option : "N/A",
    }));
    const order = {
      buyer: {
        name: values.name,
        phone: values.phone,
        email: values.email,
        address: values.address,
        comments: values.comments,
      },
      items: [...orderedProducts],
      date: new Date(),
      total: cart.getTotalPrice(),
    };
    cart.saveOrder(order);
    setFinishedOrder(true);
    setShowForm(false);
  };

  const cartMethods = {
    clear: cart.clear,
    remove: cart.removeItem,
    total: cart.getTotalPrice,
    increaseQuantity: cart.increaseQuantity,
    decreaseQuantity: cart.decreaseQuantity,
  };

  return (
    <div className="centered">
      <Alert show={finishedOrder} variant="success">
        <p>
          Se ha realizado tu pedido exitosamente {user.name}. El número de
          registro del pedido es: {cart.getOrderID()}
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
            products={cart.cartProducts}
            cartMethods={cartMethods}
            finished={finishedOrder}
            disable={checkingStock}
          />
          <hr />
          {!finishedOrder && user.name && (
            <>
              <Button onClick={handleShowForm} className="closeBtn" disabled={checkingStock}>
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
