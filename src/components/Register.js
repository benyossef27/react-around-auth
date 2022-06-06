import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import auth from "../utils/Auth";

export default function Register({
  registered,
  handleRegisterSubmit,

  props,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useNavigate();

  const resetForm = () => {
    setEmail("");
    setPassword("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    auth
      .register({ email, password })
      .then(resetForm)
      .then((res) => {
        props.handleToolTip("success");
        return res;
      })
      .then((res) => {
        history.push("/signin");
        return res;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      history.push("/main");
    }
  }, [history]);

  useEffect(() => {
    if (registered) {
      history.push("/signin");
    }
  }, [history, registered]);
  return (
    <div className="sign">
      <h2 className="sign__title">Sign up</h2>
      <form className="sign__form">
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
        <button
          type="submit"
          className="sign__button"
          onSubmit={handleSubmit}
          to="/main"
        >
          Sign up
        </button>
      </form>
      <Link to="/signin" className="sign__link">
        Already a member? Log in here!
      </Link>
    </div>
  );
}
