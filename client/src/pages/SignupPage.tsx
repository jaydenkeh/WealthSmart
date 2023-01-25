import { useState, useEffect, SyntheticEvent } from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormContainer from "../components/FormContainer";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios, { AxiosError } from "axios";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/; // min. 4 characters, must begin with a letter
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/; // min. 8 characters, must include uppercase and lowercase letter, a number and a special character
const REGISTER_URL = "http://localhost:3000/api/signup";
const ACCOUNTVALUE_URL = "http://localhost:3000/api/accountvalue";

const SignupPage: React.FC = () => {
  const [userName, setUsername] = useState("");
  const [validName, setValidName] = useState(false);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);

  const [password, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setValidName(USER_REGEX.test(userName));
  }, [userName]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(password));
    setValidMatch(password === matchPwd);
  }, [password, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [userName, email, password, matchPwd]);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const v1 = USER_REGEX.test(userName);
    const v2 = EMAIL_REGEX.test(email);
    const v3 = PWD_REGEX.test(password);
    if (!v1 || !v2 || !v3) {
      setErrMsg("Invalid Entry");
      return;
    }
    try {
      const response = await axios.post(
        REGISTER_URL,
        {
          userName: userName,
          email: email,
          password: password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.status === 201) {
        //make post request to accountValue route to set up user initial account balances
        const initialAssetBalance = 100000;
        const initialSecuritiesValue = 0;
        const initialcashBalance = 100000;
        const initialProfitLoss = 0;
        await axios.post(
          ACCOUNTVALUE_URL,
          {
            totalAssets: initialAssetBalance,
            totalSecuritiesValue: initialSecuritiesValue,
            cashBalance: initialcashBalance,
            totalProfitLoss: initialProfitLoss,
            userEmail: email,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        setSuccess(true);
        //clear state and controlled inputs
        setUsername("");
        setEmail("");
        setPwd("");
        setMatchPwd("");
      }
    } catch (err: any) {
      if (typeof err === "object" && "response" in err) {
        const axiosError = err as AxiosError;
        if (axiosError?.response?.status === 409) {
          setErrMsg(
            "Existing user with email in use, please use a different email"
          );
        } else {
          setErrMsg("Registration Failed");
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
          <h1>Success!</h1>
          <p>
            <a href="/login">Sign In</a>
          </p>
        </section>
      ) : (
        <section>
          <p className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">
            {errMsg}
          </p>
          <FormContainer>
            <h1>Sign Up</h1>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="my-3" controlId="userName">
                <Form.Label>Username</Form.Label>
                <FontAwesomeIcon
                  icon={faCheck}
                  className={validName ? "valid" : "hide"}
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className={validName || !userName ? "hide" : "invalid"}
                />
                <Form.Control
                  type="userName"
                  placeholder="Enter your username"
                  value={userName}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  aria-invalid={validName ? "false" : "true"}
                  aria-describedby="uidnote"
                />
                <p
                  id="uidnote"
                  className={
                    userName && !validName ? "instructions" : "offscreen"
                  }
                >
                  <FontAwesomeIcon icon={faInfoCircle} />
                  4 to 24 characters.
                  <br />
                  Must begin with a letter.
                  <br />
                  Letters, numbers, underscores, hyphens allowed.
                </p>
              </Form.Group>

              <Form.Group className="my-3" controlId="email">
                <Form.Label>Email address</Form.Label>
                <FontAwesomeIcon
                  icon={faCheck}
                  className={validEmail ? "valid" : "hide"}
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className={validEmail || !email ? "hide" : "invalid"}
                />
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-invalid={validEmail ? "false" : "true"}
                  aria-describedby="emailnote"
                />
                <p
                  id="emailnote"
                  className={
                    email && !validEmail ? "instructions" : "offscreen"
                  }
                >
                  <FontAwesomeIcon icon={faInfoCircle} />
                  Must begin with a letter.
                  <br />
                  Letters, numbers, underscores allowed.
                </p>
              </Form.Group>

              <Form.Group className="my-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <FontAwesomeIcon
                  icon={faCheck}
                  className={validPwd ? "valid" : "hide"}
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className={validPwd || !password ? "hide" : "invalid"}
                />
                <Form.Control
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPwd(e.target.value)}
                  required
                  aria-invalid={validPwd ? "false" : "true"}
                  aria-describedby="passwordnote"
                />
                <p
                  id="passwordnote"
                  className={
                    password && !validPwd ? "instructions" : "offscreen"
                  }
                >
                  <FontAwesomeIcon icon={faInfoCircle} />
                  8 to 24 characters.
                  <br />
                  Must include uppercase and lowercase letters, a number and a
                  special character.
                  <br />
                  Allowed special characters:{" "}
                  <span aria-label="exclamation mark">!</span>{" "}
                  <span aria-label="at symbol">@</span>{" "}
                  <span aria-label="hashtag">#</span>{" "}
                  <span aria-label="dollar sign">$</span>{" "}
                  <span aria-label="percent">%</span>
                </p>
              </Form.Group>
              <Form.Group className="my-3" controlId="confirm-password">
                <Form.Label>Confirm Your Password</Form.Label>
                <FontAwesomeIcon
                  icon={faCheck}
                  className={validMatch && matchPwd ? "valid" : "hide"}
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className={validMatch || !matchPwd ? "hide" : "invalid"}
                />
                <Form.Control
                  type="password"
                  placeholder="Confirm your password"
                  onChange={(e) => setMatchPwd(e.target.value)}
                  value={matchPwd}
                  required
                  aria-invalid={validMatch ? "false" : "true"}
                  aria-describedby="confirmnote"
                />
                <p
                  id="confirmnote"
                  className={
                    matchPwd && !validMatch ? "instructions" : "offscreen"
                  }
                >
                  <FontAwesomeIcon icon={faInfoCircle} />
                  Must match the first password input field.
                </p>
              </Form.Group>
              <Button
                className="my-3"
                variant="primary"
                type="submit"
                disabled={
                  !validName || !validEmail || !validPwd || !validMatch
                    ? true
                    : false
                }
              >
                Submit
              </Button>
            </Form>
            <Form.Text muted>
              Already registered? <Link to="/login">Sign In</Link>
            </Form.Text>
          </FormContainer>
        </section>
      )}
    </>
  );
};

export default SignupPage;
