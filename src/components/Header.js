import React from "react";
import logo from "../images/header/header__title.svg";

export default function Header() {
  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="Around The U.S." />
    </header>
  );
}
