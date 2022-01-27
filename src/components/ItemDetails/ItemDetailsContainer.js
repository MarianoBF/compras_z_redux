import ItemDetails from "./ItemDetails";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import useMounted from "../../hooks/useMounted";
import { useHistory } from "react-router-dom";
import { addProduct } from "../../redux/actions/cartActions";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

export default function ItemListContainer() {
  const [product, setProduct] = useState({});
  const { id_product } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const isMounted = useMounted();
  const [outOfRange, setOutOfRange] = useState(false);
  const history = useHistory();
  const cartProducts = useSelector((state) => state.cart.cartProducts);
  const inCart = () => {
    return cartProducts.filter((item) => +item.id === +id_product).length > 0;
  };
  const products = useSelector((state) => state.products.products);

  const [wait, setWait] = useState(false);

  useEffect(() => {
    if (products === undefined) {
      setWait(true);
      setTimeout(setWait(false), 2000);
    } else {
      const currentProduct =
        products.filter((item) => +item.id === +id_product)[0] || [];

      if (currentProduct?.length === 0 || currentProduct === undefined) {
        setOutOfRange(true);
        setTimeout(() => {
          setOutOfRange(false);
          history.push("/");
        }, 2000);
      } else if (isMounted.current) {
        setProduct(currentProduct);
        setIsLoading(false);
      }
    }
  }, [history, id_product, isMounted, products, wait]);

  const dispatch = useDispatch();

  const addToCart = (quantity, id) => {
    dispatch(addProduct(quantity, id));
  };

  if (isLoading || wait) {
    return (
      <div style={{ textAlign: "center" }}>
        <h2>Trayendo información del producto...</h2>
        <Spinner animation="border" />
      </div>
    );
  }

  if (outOfRange) {
    return (
      <div style={{ textAlign: "center" }}>
        <h2>Producto inexistente</h2>
        <h2>Serás redirigido a la página principal</h2>
      </div>
    );
  }

  return (
    <>
      <h1 className="mainTitle">Detalles del producto</h1>
      <ItemDetails item={product} addToCart={addToCart} inCart={inCart} />
    </>
  );
}
