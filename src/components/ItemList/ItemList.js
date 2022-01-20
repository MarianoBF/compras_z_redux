import CardDeck from "react-bootstrap/CardDeck";
import Item from "./Item";

export default function ItemList({products, inCart}) {
  const productList = products?.map(item => (
    <Item
      key={item.id}
      item={item}
      image={item.image}
      name={item.name}
      description={item.description}
      stock={item.stock}
      initialValue={item.initialValue}
      inCart={inCart}
    />
  ));

  return <CardDeck className="cardDeck">{productList}</CardDeck>;
}
