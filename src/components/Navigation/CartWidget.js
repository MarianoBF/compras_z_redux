import {Cart} from "react-bootstrap-icons";
import {useCart} from "../../context/CartContext";

const styles = {
  div: {
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  number: {
    fontSize: "20px",
    margin: "0 10px",
  },
};

export default function CartWidget() {
  const cart = useCart();

  const NumberOfItems = cart.getTotalNumberOfItems();

  return (
    <div style={styles.div}>
      {NumberOfItems > 0 && (
        <>
          <Cart size={30} />
          <div style={styles.number}>({NumberOfItems})</div>
        </>
      )}
    </div>
  );
}
