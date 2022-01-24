import ItemDetails from "./ItemDetails";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import {useCart} from "../../context/CartContext";
import useMounted from "../../hooks/useMounted";
import {useHistory} from "react-router-dom";
import {useProducts} from "../../context/ProductsContext";
import { addProduct } from '../../redux/actions/cartActions'
import { useDispatch } from 'react-redux'

export default function ItemListContainer() {
  const cart = useCart();
  const [product, setProduct] = useState({});
  const {id_product} = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const isMounted = useMounted();
  const [outOfRange, setOutOfRange] = useState(false);
  const history = useHistory();
  const prods = useProducts();

  const inCart = cart.isInCart(id_product);
  
  const [wait, setWait] = useState(false)

  useEffect(() => {
    const currentProduct = prods.getProductById(id_product);
   if (currentProduct === undefined) {
      setWait(true)
      setTimeout(setWait(false),2000)
    }
    else if (currentProduct?.length === 0 || currentProduct === undefined) {
      setOutOfRange(true);
      setTimeout(() => {
        setOutOfRange(false);
        history.push("/");
      }, 2000);
    } else if (isMounted.current) {
      setProduct(currentProduct);
      setIsLoading(false);
    }
    //eslint-disable-next-line
  }, [id_product,isMounted, prods, wait]);

  const dispatch = useDispatch()

  const addToCart = (quantity, id) => {
    dispatch(addProduct( quantity, id ))
  };

  if (isLoading || wait) {
    return (
      <div style={{textAlign: "center"}}>
        <h2>Trayendo información del producto...</h2>
        <Spinner animation="border" />
      </div>
    );
  }

  if (outOfRange) {
    return (
      <div style={{textAlign: "center"}}>
        <h2>Producto inexistente</h2>
        <h2>Serás redirigido a la página principal</h2>
      </div>
    );
  }

  return (
    <>
      <h1 className="mainTitle">Detalles del producto</h1>
      <ItemDetails
        item={product}
        addToCart={addToCart}
        inCart={inCart}
      />
    </>
  );
}
