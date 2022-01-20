import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import logo from "../../assets/logo192.png";
import CartWidget from "./CartWidget";
import { LinkContainer } from "react-router-bootstrap";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../../context/ProductsContext";

const styles = {
  categories: {
    padding: "15px",
    fontWeight: "bolder",
    textAlign: "center",
    color: "#ccc",
  },
  actionLink: {
    padding: "15px",
    fontWeight: "bold",
    color: "green",
    textAlign: "center",
    border: "none",
  },
  cart: {
    textDecoration: "none",
    marginLeft: "auto",
  },
  navbar: {
    padding: "20px",
    width: "100%",
  },
  brand: {
    textAlign: "center",
  },
};

function NavBar({ login, logout, user }) {
  const [categories, setCategories] = useState([]);
  const prods = useProducts();

  useEffect(() => {
    setCategories(prods.getCategories());
  }, [user, prods]);

  const categoryList = categories.map((item) => (
    <LinkContainer
      style={styles.categories}
      to={"/category/" + item.id}
      key={item.id}
    >
      <Nav.Link active={false}>{item.name}</Nav.Link>
    </LinkContainer>
  ));

  return (
    <Navbar style={styles.navbar} collapseOnSelect expand="lg" variant="dark">
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <LinkContainer to={"/"}>
          <Navbar.Brand style={styles.brand}>
            <img src={logo} alt="logo" className="logo" />
          </Navbar.Brand>
        </LinkContainer>
        <Nav className="justify-content-center">
          <LinkContainer style={styles.actionLink} to={"/"}>
            <Nav.Link>Inicio</Nav.Link>
          </LinkContainer>
          {categoryList}
          <LinkContainer style={styles.actionLink} to={"/orders/search"}>
            <Nav.Link>Buscar Orden</Nav.Link>
          </LinkContainer>
          {!user.name && (
            <Nav.Link style={styles.actionLink} onClick={login}>
              Login
            </Nav.Link>
          )}
          {user.name && (
            <>
              <LinkContainer style={styles.actionLink} to={"/orders"}>
                <Nav.Link>Mis órdenes</Nav.Link>
              </LinkContainer>
              <Nav.Link style={styles.actionLink} onClick={logout}>
                {user.name} <br /> Logout
              </Nav.Link>
            </>
          )}
        </Nav>
        <Link style={styles.cart} to={"/cart"}>
          <CartWidget className="justify-content-end" />
        </Link>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavBar;
