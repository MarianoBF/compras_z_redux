import { Cart } from "react-bootstrap-icons";
import { useSelector } from "react-redux";

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
  const itemsReducer = (prev, cur) => prev + cur.quantity;
  const NumberOfItems = useSelector((state) => state.cart.cartProducts).reduce(
    itemsReducer,
    0
  );

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
