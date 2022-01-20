import { useState, useEffect, useContext, createContext } from "react";
import { getFirestore } from "../firebase";
import emailjs from "emailjs-com";
import { useProducts } from "./ProductsContext";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [cartProducts, setCartProducts] = useState([]);

  const prods = useProducts();

  const {
    REACT_APP_MAIL_TEMPLATE,
    REACT_APP_MAIL_USER_ID,
    REACT_APP_MAIL_SERVICE,
  } = process.env;

  useEffect(() => {
    retrieveProducts();
  }, []);

  function retrieveProducts() {
    try {
      const local = localStorage.getItem("compras_z_cart");
      if (local?.length > 0) {
        const existingCart = JSON.parse(local);
        setCartProducts(existingCart);
      }
    } catch {
      console.log("Unable to recover previous order");
    } finally {
      const db = getFirestore();
      const itemCollection = db.collection("products");
      itemCollection
        .get()
        .then((data) => {
          setAllProducts(data.docs.map((item) => item.data()));
        })
        .catch((error) => console.log(error));
    }
  }

  const addItem = (quantity, product_id, option) => {
    const filtered = cartProducts.filter((item) => item.id === product_id);
    if (
      filtered.length === 0 ||
      (option && filtered[0].option.value !== option)
    ) {
      const retrieveProduct = allProducts.filter(
        (item) => item.id === product_id
      );
      const newCart = [
        ...cartProducts,
        {
          id: product_id,
          quantity,
          option,
          name: retrieveProduct[0].name,
          price: retrieveProduct[0].price,
          stock: retrieveProduct[0].stock,
          image: retrieveProduct[0].image,
        },
      ];
      newCart.sort((a, b) => (a.name > b.name ? 1 : -1));
      setCartProducts(newCart);
      localStorage.setItem("compras_z_cart", JSON.stringify(newCart));
    }
  };

  const removeItem = (product_id, option) => {
    let filtered;
    if (option) {
      const otherOptions = cartProducts
        .filter((item) => item.id === product_id)
        .filter((item) => item.option.value !== option.value);
      const otherProds = cartProducts.filter((item) => item.id !== product_id);
      filtered = [...otherProds, ...otherOptions];
    } else {
      filtered = cartProducts.filter((item) => item.id !== product_id);
    }
    filtered.sort((a, b) => (a.name > b.name ? 1 : -1));
    setCartProducts(filtered);
    localStorage.setItem("compras_z_cart", JSON.stringify(filtered));
  };

  const clear = () => {
    setCartProducts([]);
    setOrderID("");
    localStorage.setItem("compras_z_cart", []);
  };

  const clearFromLocalStorage = () => {
    localStorage.setItem("compras_z_cart", []);
  };

  const isInCart = (product_id) => {
    return !(
      cartProducts.filter((item) => +item.id === +product_id).length === 0
    );
  };

  const checkStock = () => {
    prods.NotifyPurchase();
    retrieveProducts();
    let stockError = [];
    cartProducts.forEach((item) => {
      const filtered = allProducts.filter((all) => all.id === item.id)[0];
      const alreadyAccountedFor = stockError.filter(
        (errorItem) => errorItem.id === item.id
      );
      if (alreadyAccountedFor.length === 0) {
        const othersInCart = cartProducts.filter(
          (cartItem) => cartItem.id === item.id
        );
        if (othersInCart.length > 1) {
          const totalQuantity = othersInCart.reduce(
            (acc, curr) => acc + curr.quantity,
            0
          );
          if (filtered.stock < totalQuantity) {
            stockError.push({
              id: item.id,
              name: item.name,
              stock: filtered.stock,
              type: "tooMuch",
            });
          } else if (totalQuantity < 1) {
            stockError.push({
              id: item.id,
              name: item.name,
              stock: filtered.stock,
              type: "tooFew",
            });
          }
        } else {
          if (filtered.stock < item.quantity) {
            stockError.push({
              id: item.id,
              name: item.name,
              stock: filtered.stock,
              type: "tooMuch",
            });
          } else if (item.quantity < 1) {
            stockError.push({
              id: item.id,
              name: item.name,
              stock: filtered.stock,
              type: "tooFew",
            });
          }
        }
      }
    });
    if (stockError.length === 0) {
      return "OK";
    } else {
      return stockError;
    }
  };

  const isOptionInCart = (product_id, option) => {
    const product = cartProducts.filter((item) => +item.id === +product_id);
    const match = product.filter((item) => item.option.value === option);
    return match.length > 0;
  };

  const getTotalNumberOfItems = () => {
    const reducer = (prev, cur) => prev + cur.quantity;
    const totalItems = cartProducts.reduce(reducer, 0);
    return totalItems;
  };

  const getTotalPrice = () => {
    const reducer = (prev, cur) => prev + cur.quantity * cur.price;
    const totalPrice = cartProducts.reduce(reducer, 0);
    return totalPrice;
  };

  const increaseQuantity = (product_id, option) => {
    let position;
    const newProducts = [...cartProducts];
    if (option?.name) {
      position = newProducts.findIndex(
        (item) => item.option.value === option.value && +item.id === +product_id
      );
    } else {
      position = cartProducts.findIndex((item) => +item.id === +product_id);
    }
    if (newProducts[position].quantity <= newProducts[position].stock) {
      newProducts[position].quantity++;
      setCartProducts(newProducts);
    }
  };

  const decreaseQuantity = (product_id, option) => {
    let position;
    const newProducts = [...cartProducts];
    if (option?.name) {
      position = newProducts.findIndex(
        (item) => item.option.value === option.value && +item.id === +product_id
      );
    } else {
      position = cartProducts.findIndex((item) => +item.id === +product_id);
    }
    if (newProducts[position].quantity >= 2) {
      newProducts[position].quantity--;
      setCartProducts(newProducts);
    }
  };

  const [orderID, setOrderID] = useState(null);

  const getOrderID = () => {
    return orderID;
  };

  const itemsIntoText = (items) => {
    let message = "";
    for (let item of items) {
      message += `${item.quantity} unidad(es) del artículo ${item.title} con precio unitario AR$ ${item.price}`;
      message += "<br>";
    }
    return message;
  };

  const sendOrderMail = (order, id) => {
    const templateParams = {
      buyerMail: order?.buyer?.email,
      nombre: order?.buyer?.name,
      id_pedido: id,
      articulos: itemsIntoText(order?.items),
      direccion: order?.buyer?.address,
      total: order?.total,
    };
    emailjs
      .send(
        REACT_APP_MAIL_SERVICE,
        REACT_APP_MAIL_TEMPLATE,
        templateParams,
        REACT_APP_MAIL_USER_ID
      )
      .then((res) => {
        // console.log(res.status)
      });
  };

  const saveOrder = (order) => {
    getFirestore()
      .collection("orders")
      .add(order)
      .then((res) => {
        order.items.forEach((item) =>
          getFirestore()
            .collection("products")
            .doc(String(item.id))
            .update({ stock: item.stock - item.quantity })
        );
        setOrderID(res.id);
        setTimeout(() => {
          sendOrderMail(order, res.id);
          clearFromLocalStorage();
        }, 500);
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  };

  return (
    <CartContext.Provider
      value={{
        cartProducts,
        addItem,
        removeItem,
        clear,
        isInCart,
        isOptionInCart,
        getTotalNumberOfItems,
        getTotalPrice,
        increaseQuantity,
        decreaseQuantity,
        checkStock,
        saveOrder,
        getOrderID,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
