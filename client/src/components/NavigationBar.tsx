import React, { useContext } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { AuthContext } from "../context/AuthContext";

const NavigationBar: React.FC = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        {isAuthenticated ? (
          <>
            <Navbar.Brand href="/">Wealth Smart</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
              <Nav
                className="me-auto my-2 my-lg-0"
                style={{ maxHeight: "100px" }}
                navbarScroll
              >
                <Nav.Link href="/portfolio">My Portfolio</Nav.Link>
                <Nav.Link href="#action2">Watchlist</Nav.Link>
                <Nav.Link href="/login" onClick={() => handleLogout()}>
                  Logout
                </Nav.Link>
              </Nav>
              <Form className="d-flex">
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                />
                <Button variant="outline-success">Search</Button>
              </Form>
            </Navbar.Collapse>
          </>
        ) : (
          <>
            <Navbar.Brand href="/login">Wealth Smart</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll" className="d-flex">
              <Nav style={{ maxHeight: "100px" }} navbarScroll>
                <Nav.Link href="/signup">Sign Up</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </>
        )}
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
