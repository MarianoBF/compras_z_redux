import Button from "react-bootstrap/Button";
import {Link} from "react-router-dom";

export default function ErrorComponent() {
    return(<div className="centered">
        <h1>Página no encontrada</h1>
        <p>No encontramos la página solicitada</p>
        <Link to={"/"}>
          <Button>Ir a la pantalla principal</Button>
        </Link>
    </div>
    )
}