import { useState, useEffect, SyntheticEvent, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormContainer from "../components/FormContainer";
import axios, { AxiosError } from "axios";
import { AuthContext } from "../context/AuthContext";
import Investment from "../assets/Investment.jpg";

const LOGIN_URL = "http://localhost:3000/api/login";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    setErrMsg("");
  }, [email, password]);

  useEffect(() => {
    if (success) {
      navigate("/");
    }
  }, [success, navigate]);

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
      setIsAuthenticated(true);
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
      <div className="login-container">
        <p className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">
          {errMsg}
        </p>
        <FormContainer>
          <h1>Login</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="my-3 col-8" controlId="email">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </Form.Group>

            <Form.Group className="my-3 col-8" controlId="password">
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
        <img src={Investment} className="investment-img" />
      </div>
    </>
  );
};

export default LoginPage;
