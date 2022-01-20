import Button from "react-bootstrap/Button";
import {useState} from "react";
import { useDispatch } from 'react-redux'
import { addProduct } from '../../redux/actions'



export default function ItemCount({
  stock,
  id,
  initialValue,
  handleAdd,
  showBuy,
  optionInCart,
}) {
  const [quantity, setQuantity] = useState(initialValue || 1);

  const handleMore = () => {
    if (quantity < stock) {
      setQuantity(quantity => quantity + 1);
    }
  };

  const handleLess = () => {
    if (quantity > 1) {
      setQuantity(quantity => quantity - 1);
    }
  };
  const dispatch = useDispatch()

  const handleAddRedux = (id) => {
    dispatch(addProduct({ text: id }))
  }

  return (
    <>
      {(!showBuy || !optionInCart) && (
        <>
          <Button color="info" onClick={handleMore}>
            {" "}
            +{" "}
          </Button>
          {` ${quantity} `}
          <Button color="info" onClick={handleLess}>
            {" "}
            -{" "}
          </Button>{" "}
          <Button
            className="spacedButton"
            onClick={() => handleAdd(quantity, id)}>
            Agregar al Carrito
          </Button>
          <Button
            className="spacedButton"
            onClick={() => handleAddRedux(id)}>
            Agregar al Carrito Redux
          </Button>
        </>
      )}
    </>
  );
}
