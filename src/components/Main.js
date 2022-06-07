import avatar_edit from "../images/profile/profile__popup-button.svg";
import React from "react";
import Card from "./Card";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

export default function Main(props) {
  const currentUser = React.useContext(CurrentUserContext);

  return (
    <main className="content">
      <section className="profile">
        <div className="profile__avatar-box" onClick={props.onEditAvatarClick}>
          <img className="profile__avatar" alt="you" src={currentUser.avatar} />
          <img
            className="profile__avatar-edit"
            src={avatar_edit}
            alt={currentUser.name}
          />
        </div>
        <div className="profile__details">
          <h1 className="profile__name">{currentUser.name}</h1>
          <p className="profile__job">{currentUser.about}</p>
        </div>
        <button
          className="profile__popup-button"
          aria-label="popupen"
          type="button"
          onClick={props.onEditProfileClick}
        ></button>
        <button
          className="profile__add-button"
          aria-label="addbutton"
          type="button"
          onClick={props.onAddPlaceClick}
        ></button>
      </section>
      <section className="cards">
        {props.cards.slice(0, 30).map((card) => (
          <Card
            key={card._id}
            card={card}
            onCardClick={props.onCardClick}
            onCardLike={props.onCardLike}
            onCardDelete={props.onCardDelete}
          />
        ))}
      </section>
    </main>
  );
}
