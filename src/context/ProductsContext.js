import {useState, useEffect, useContext, createContext} from "react";
import {getFirestore} from "../firebase";

const ProductsContext = createContext();

export const useProducts = () => useContext(ProductsContext);

export const ProductsProvider = ({children}) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [purchase, setPurchase] = useState(false);

  useEffect(() => {
    const db = getFirestore();
    const itemCollection = db.collection("products");
    itemCollection
      .get()
      .then(data => {
        setProducts(data.docs.map(item => item.data()));
      })
      .catch(error => console.log(error));
  }, [purchase]);

  useEffect(() => {
    const db = getFirestore();
    const itemCollection = db.collection("categories");
    itemCollection
      .get()
      .then(data => {
        setCategories(data.docs.map(item => item.data()));
      })
      .catch(error => console.log(error));
  }, []);

  const NotifyPurchase = () => {
    setPurchase(!purchase)
  }

  const getProducts = () => {
    return products;
  };

  const getSortedProducts = () => {
    return products.sort((a, b) => (+a.id > +b.id ? 1 : -1));
  };

  const getProductById = id => {
    let product;
    try {product = products.filter(item => +item.id === +id)[0];}
    catch {product = []}
    return product 
  };

  const getProductsByCategory = category => {
    return products.sort((a, b) => (+a.id > +b.id ? 1 : -1)).filter(item => item.category === category);
  };

  const getCategories = () => {
    return categories;
  };

  return (
    <ProductsContext.Provider
      value={{
        getProducts,
        getSortedProducts,
        getProductById,
        getProductsByCategory,
        getCategories,
        NotifyPurchase,
      }}>
      {children}
    </ProductsContext.Provider>
  );
};
