import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import ItemList from "./ItemList";
import Spinner from "react-bootstrap/Spinner";
import useMounted from "../../hooks/useMounted";
import {useHistory} from "react-router-dom";
import {useProducts} from "../../context/ProductsContext";
import {useCart} from "../../context/CartContext";

export default function ItemListContainer() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const {id_category} = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const isMounted = useMounted();
  const [outOfRange, setOutOfRange] = useState(false);
  const history = useHistory();
  const [noStock, setNoStock] = useState(false);
  const prods = useProducts();
  const cart = useCart();

  const inCart = (item) => cart.isInCart(item)

  useEffect(() => {
    if (id_category === undefined) {
      const allProds = prods.getSortedProducts();
      if (isMounted.current) {
        setProducts(
          allProds.filter(item => (noStock ? item.stock >= 0 : item.stock > 0))
        );
        setIsLoading(false);
      }
    } else {
      const allProds = prods.getProductsByCategory(+id_category);
      if (isMounted.current) {
        if (allProds.length === 0) {
          setOutOfRange(true);
          setTimeout(() => {
            setOutOfRange(false);
            history.push("/");
          }, 2000);
        } else {
          setProducts(
            allProds.filter(item =>
              noStock ? item.stock >= 0 : item.stock > 0
            )
          );
          setIsLoading(false);
        }
      }
    }
  }, [id_category, history, isMounted, noStock, prods]);

  useEffect(() => {
    const allCategories = prods.getCategories();
    if (isMounted.current) {
      setCategories(allCategories);
    }
  }, [isMounted, prods]);

  const [category, setCategory] = useState("");

  useEffect(() => {
    if (id_category === undefined) {
      setCategory("todas las categorías");
    } else {
      const categoryFilter = categories.filter(
        item => item.id === +id_category
      );
      setCategory(
        "la categoría " + categoryFilter[0]?.name ? categoryFilter[0]?.name : ""
      );
    }
  }, [categories, id_category, category]);

  const handleNoStock = () => {
    setNoStock(!noStock);
  };

  if (isLoading) {
    return (
      <div style={{textAlign: "center"}}>
        <h2>Trayendo listado de productos...</h2>
        <Spinner animation="border" />
      </div>
    );
  }

  if (outOfRange) {
    return (
      <div style={{textAlign: "center"}}>
        <h2>Categoría inexistente</h2>
        <h2>Serás redirigido a la página principal</h2>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mainTitle">
        Desde aquí podrás ver un listado de {category}{" "}
      </h1>
      <button onClick={handleNoStock} className="btn btn-secondary centeredBtn">
        {noStock
          ? "Sólo mostrar artículos con stock disponible"
          : "Ver artículos sin stock disponible"}
      </button>
      <ItemList products={products} inCart={inCart}/>
    </div>
  );
}
