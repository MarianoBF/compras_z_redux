import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ItemList from "./ItemList";
import Spinner from "react-bootstrap/Spinner";
import useMounted from "../../hooks/useMounted";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ItemListContainer() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const { id_category } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const isMounted = useMounted();
  const [outOfRange, setOutOfRange] = useState(false);
  const history = useHistory();
  const [noStock, setNoStock] = useState(false);

  const cartProducts = useSelector((state) => state.cart.cartProducts);

  const allProducts = useSelector((state) => state.products);

  const inCart = (id) => {
    return cartProducts.filter((item) => +item.id === +id).length > 0;
  };

  useEffect(() => {
    if (id_category === undefined) {
      const allProds = allProducts.products.sort((a, b) => (+a.id > +b.id ? 1 : -1));
      if (isMounted.current) {
        setProducts(
          allProds.filter((item) =>
            noStock ? item.stock >= 0 : item.stock > 0
          )
        );
        setIsLoading(false);
      }
    } else {
      const allProds = allProducts.products.sort((a, b) => (+a.id > +b.id ? 1 : -1)).filter(item => item.category === +id_category);
      if (isMounted.current) {
        if (allProds.length === 0) {
          setOutOfRange(true);
          setTimeout(() => {
            setOutOfRange(false);
            history.push("/");
          }, 2000);
        } else {
          setProducts(
            allProds.filter((item) =>
              noStock ? item.stock >= 0 : item.stock > 0
            )
          );
          setIsLoading(false);
        }
      }
    }
  }, [id_category, history, isMounted, noStock, allProducts.products]);

  useEffect(() => {
    const allCategories = allProducts.categories;
    if (isMounted.current) {
      setCategories(allCategories);
    }
  }, [allProducts.categories, isMounted]);

  const [category, setCategory] = useState("");

  useEffect(() => {
    if (id_category === undefined) {
      setCategory("todas las categor??as");
    } else {
      const categoryFilter = categories.filter(
        (item) => item.id === +id_category
      );
      setCategory(
        "la categor??a " + categoryFilter[0]?.name ? categoryFilter[0]?.name : ""
      );
    }
  }, [categories, id_category, category]);

  const handleNoStock = () => {
    setNoStock(!noStock);
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: "center" }}>
        <h2>Trayendo listado de productos...</h2>
        <Spinner animation="border" />
      </div>
    );
  }

  if (outOfRange) {
    return (
      <div style={{ textAlign: "center" }}>
        <h2>Categor??a inexistente</h2>
        <h2>Ser??s redirigido a la p??gina principal</h2>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mainTitle">
        Desde aqu?? podr??s ver un listado de {category}{" "}
      </h1>
      <button onClick={handleNoStock} className="btn btn-secondary centeredBtn">
        {noStock
          ? "S??lo mostrar art??culos con stock disponible"
          : "Ver art??culos sin stock disponible"}
      </button>
      <ItemList products={products} inCart={inCart} />
    </div>
  );
}
