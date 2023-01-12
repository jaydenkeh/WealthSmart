import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormContainer from "../components/FormContainer";

const SignupPage = () => {
  return (
    <FormContainer>
      <h1>Sign Up</h1>
      <Form>
        <Form.Group className="my-3" controlId="userName">
          <Form.Label>Username</Form.Label>
          <Form.Control type="email" placeholder="Enter your username" />
        </Form.Group>

        <Form.Group className="my-3" controlId="email">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter your email" />
        </Form.Group>

        <Form.Group className="my-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Enter your password" />
        </Form.Group>
        <Button className="my-3" variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </FormContainer>
  );
};

export default SignupPage;
