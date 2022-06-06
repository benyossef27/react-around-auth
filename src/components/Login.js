import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import auth from "../utils/Auth";

export default function Login({
  email,
  loggedIn,
  userEmail,
  setUserEmail,
  password,
  setPassword,
  handleLoginSubmit,
  setEmail,
  props,
}) {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const history = useNavigate();

  const resetForm = () => {
    setEmail("");
    setPassword("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    auth
      .authorize(email, password)
      .then((data) => {
        if (!email || !password) {
          throw new Error("400 - one or more of the fields were not provided");
        }
        if (!data) {
          throw new Error("401 - the user with the specified email not found");
        }
        if (data.token) {
          props.handleLogin();
        }
      })
      .then(() => history.push("/main"))
      .then(resetForm)
      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      history.push("/main");
      setUserEmail(email || userEmail);
    }
  }, [history, email, userEmail, setUserEmail]);

  useEffect(() => {
    if (loggedIn) {
      history.push("/main");
      setUserEmail(email || userEmail);
    }
  }, [history, email, loggedIn, userEmail, setUserEmail]);
  return (
    <div className="sign">
      <h2 className="sign__title">Log in</h2>
      <form
        className="sign__form"
        action="#"
        title="Log in"
        onSubmit={handleLoginSubmit}
        to="/main"
      >
        <input
          className="sign__input"
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="sign__input"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="sign__button" type="submit" onClick={handleSubmit}>
          Log in
        </button>
      </form>
      <Link to="signup" className="sign__link">
        Not a member yet? Sign up here!
      </Link>
    </div>
  );
}
