import React, { useContext } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { LoginContext } from "../App";

const NavigationBar: React.FC = () => {
  const { isLoggedIn } = useContext(LoginContext);

  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        {isLoggedIn ? (
          <>
            <Navbar.Brand href="/">Wealth Smart</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
              <Nav
                className="me-auto my-2 my-lg-0"
                style={{ maxHeight: "100px" }}
                navbarScroll
              >
                <Nav.Link href="#action1">My Portfolio</Nav.Link>
                <Nav.Link href="#action2">Watchlist</Nav.Link>
                <Nav.Link>Logout</Nav.Link>
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
