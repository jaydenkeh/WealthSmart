import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { AuthContext } from "../context/AuthContext";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const NavigationBar: React.FC = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
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
                className="me-auto my-2 my-lg-1"
                style={{ maxHeight: "100px" }}
                navbarScroll
              >
                <Nav.Link href="/portfolio">Investment Portfolio</Nav.Link>
                <Nav.Link href="/watchlist">Watchlist</Nav.Link>
                <Nav.Link onClick={() => handleLogout()}>Logout</Nav.Link>
              </Nav>
              {/* TODO future implementation */}
              <Form className="d-flex">
                <Form.Control
                  type="search"
                  placeholder="Enter your search here"
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
