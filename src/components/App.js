import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import React from "react";
import { useEffect, useState } from "react";
import api from "../utils/api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import DeleteCardPopup from "./DeleteCardPopup";
import { SpinnerInfinity } from "spinners-react";

export default function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAvatarPopupOpen, setIsAvatarPopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [editAvaterButton, setEditAvatarButton] = useState("save");
  const [editProfileButton, setEditProfileButton] = useState("save");
  const [editAddPlaceButton, setEditAddPlaceButton] = useState("add");
  const [editDeleteCardButton, setEditDeleteCardButton] = useState("Yes");
  const [deleteCard, setDeleteCard] = useState(null);
  const [loading, setLoading] = useState(true);

  function handleEditProfileClick() {
    setEditProfileButton("save");
    setIsEditProfilePopupOpen(true);
  }
  function handleAvatarClick() {
    setEditAvatarButton("save");
    setIsAvatarPopupOpen(true);
  }
  function handleAddPlaceClick() {
    setEditAddPlaceButton("add");
    setIsAddPlacePopupOpen(true);
  }
  function handleDeleteClick(card) {
    setEditDeleteCardButton("Yes");
    setIsDeletePopupOpen(true);
    setDeleteCard(card);
  }
  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleUpdateUser({ name, about }) {
    setEditProfileButton("saving...");
    api
      .setUserInfo({ name, about })
      .then((info) => {
        setCurrentUser(info);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
  }
  function handleUpdateAvatar({ avatar }) {
    setEditAvatarButton("saving...");
    api
      .setUserAvatar(avatar)
      .then((info) => {
        setCurrentUser(info);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
  }
  function handleAddPlaceSubmit(info) {
    setEditAddPlaceButton("adding...");
    api
      .createCard(info)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
  }
  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsDeletePopupOpen(false);
    setSelectedCard(null);
  }

  useEffect(() => {
    api
      .getUserInfo()
      .then((userData) => setCurrentUser(userData))
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
    const closeByOverLay = (evt) => {
      if (
        evt.target.classList.contains("popup_opened") ||
        evt.target.classList.contains("popup__close")
      ) {
        closeAllPopups();
      }
    };

    document.addEventListener("click", closeByOverLay);
    return () => document.removeEventListener("click", closeByOverLay);
  }, []);

  useEffect(() => {
    api
      .getInitialCards()
      .then((Data) => {
        setCards((cards) => [...cards, ...Data]);
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      });

    const closeByEscape = (e) => {
      if (e.key === "Escape") {
        closeAllPopups();
      }
    };

    document.addEventListener("keydown", closeByEscape);
    return () => document.removeEventListener("keydown", closeByEscape);
  }, []);

  function handleCardLike(card) {
    const isLiked = card.likes.some((user) => user._id === currentUser._id);
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((currentCard) =>
            currentCard._id === card._id ? newCard : currentCard
          )
        );
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
  }
  function handleCardDelete(card) {
    setEditDeleteCardButton("deleteing...");
    api
      .deleteCard(card._id)
      .then(() => {
        setCards(cards.filter((deleted) => deleted._id !== card._id));
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
  }

  return loading ? (
    <div className="page">
      <div className="root">
        <Header />
        <div className="loading">
          <SpinnerInfinity
            size={500}
            speed={100}
            color="cyan"
            display="flex"
            display="flex"
            alignself="center"
          />
        </div>
        <p className="loading__text">Loading...</p>
        <Footer />
      </div>
    </div>
  ) : (
    <div className="page">
      <div className="root">
        <CurrentUserContext.Provider value={currentUser}>
          <Header />
          <Main
            cards={cards}
            onCardLike={handleCardLike}
            onEditProfileClick={handleEditProfileClick}
            onEditAvatarClick={handleAvatarClick}
            onAddPlaceClick={handleAddPlaceClick}
            onCardDelete={handleDeleteClick}
            onCardClick={handleCardClick}
          />
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
            buttonText={editProfileButton}
          />
          <EditAvatarPopup
            isOpen={isAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
            buttonText={editAvaterButton}
          />
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlaceSubmit={handleAddPlaceSubmit}
            buttonText={editAddPlaceButton}
          />
          <DeleteCardPopup
            isOpen={isDeletePopupOpen}
            onClose={closeAllPopups}
            onCardDelete={handleCardDelete}
            buttonText={editDeleteCardButton}
            card={deleteCard}
          />
          <ImagePopup card={selectedCard} onClose={closeAllPopups}></ImagePopup>
          <Footer />
        </CurrentUserContext.Provider>
      </div>
    </div>
  );
}
