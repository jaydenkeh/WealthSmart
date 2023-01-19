import { useState, useEffect, SyntheticEvent } from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormContainer from "../components/FormContainer";
import axios, { AxiosError } from "axios";

const LOGIN_URL = "http://localhost:3000/api/login";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setErrMsg("");
  }, [email, password]);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        LOGIN_URL,
        {
          email: email,
          password: password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setEmail("");
      setPwd("");
      setSuccess(true);
      localStorage.setItem("token", response.data.token);
    } catch (err: any) {
      if (typeof err === "object" && "response" in err) {
        const axiosError = err as AxiosError;
        if (axiosError?.response?.status === 400) {
          setErrMsg("Missing Email or Password");
        } else if (axiosError?.response?.status === 401) {
          setErrMsg("Unauthorized");
        }
      } else {
        setErrMsg("No Server Response");
      }
    }
  };

  return (
    <>
      {success ? (
        <section>
          <h1>You are logged in!</h1>
          <br />
          <p>
            <a href="#">Go to Home</a>
          </p>
        </section>
      ) : (
        <section>
          <p className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">
            {errMsg}
          </p>
          <FormContainer>
            <h1>Login</h1>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="my-3" controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                />
              </Form.Group>

              <Form.Group className="my-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your password"
                  onChange={(e) => setPwd(e.target.value)}
                  value={password}
                  required
                />
              </Form.Group>
              <Button className="my-3" variant="primary" type="submit">
                Login
              </Button>
            </Form>
            <Form.Text muted>
              Need an account? <Link to="/signup">Sign Up Now</Link>
            </Form.Text>
          </FormContainer>
        </section>
      )}
    </>
  );
};

export default LoginPage;
