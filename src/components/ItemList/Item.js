import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import {Link} from "react-router-dom";

const styles = {
  Image: {
    maxHeight: "100px",
    maxWidth: "200px",
    objectFit: "contain",
    margin: "5px auto",
  },
  CBody: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
  },
  CBodyBelow: {
    alignSelf: "flex-end"
  }
};

export default function ItemList({item, name, image, description, stock, inCart}) {

  return (
    <Card border="dark" className="card" bg="light">
      <Card.Header>{name}</Card.Header>
      <Card.Img
        variant="top"
        src={image}
        style={styles.Image}
        alt="Imagen del producto"
      />
      <Card.Body style={styles.CBody}>
        <Card.Text>{description}</Card.Text>
        <p className="inCartMessage">{inCart(item.id)&&"(Ya tenés este producto en tu carro)"}</p>
        <Link to={"/item/" + item.id} style={styles.CBodyBelow}>
          <Button className="spacedButton">Ver detalle del producto</Button>
        </Link>
      </Card.Body>
      <Card.Footer>
        <p style={{display: "inline"}}>Stock disponible: {stock}</p>
      </Card.Footer>
    </Card>
  );
}
