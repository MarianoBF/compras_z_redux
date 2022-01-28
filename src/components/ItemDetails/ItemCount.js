import Button from "react-bootstrap/Button";
import { useState } from "react";

export default function ItemCount({
  stock,
  id,
  initialValue,
  handleAdd,
  showBuy,
}) {
  const [quantity, setQuantity] = useState(initialValue || 1);

  const handleMore = () => {
    if (quantity < stock) {
      setQuantity((quantity) => quantity + 1);
    }
  };

  const handleLess = () => {
    if (quantity > 1) {
      setQuantity((quantity) => quantity - 1);
    }
  };

  return (
    <>
      {(!showBuy) && (
        <>
          <Button color="info" onClick={handleLess}>
            {" "}
            -{" "}
          </Button>
          {` ${quantity} `}
          <Button color="info" onClick={handleMore}>
            {" "}
            +{" "}
          </Button>{" "}
          <Button
            className="spacedButton"
            onClick={() => handleAdd(quantity, id)}
          >
            Agregar al Carrito
          </Button>
        </>
      )}
    </>
  );
}
