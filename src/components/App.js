import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import { React, useEffect, useState } from "react";
import api from "../utils/api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import DeleteCardPopup from "./DeleteCardPopup";
import { SpinnerInfinity } from "spinners-react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "../utils/ProtectedRoute";
import InfoToolTip from "./InfoToolTip";
import auth from "../utils/Auth";

export default function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAvatarPopupOpen, setIsAvatarPopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isInfoToolTipOpen, setIsInfoToolTipOpen] = useState(false);

  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [editAvaterButton, setEditAvatarButton] = useState("save");
  const [editProfileButton, setEditProfileButton] = useState("save");
  const [editAddPlaceButton, setEditAddPlaceButton] = useState("add");
  const [editDeleteCardButton, setEditDeleteCardButton] = useState("Yes");
  const [deleteCard, setDeleteCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [tooltipMode, setTooltipMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const history = useNavigate();

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

  function handleToolTip(success) {
    setTooltipMode(success);
    setIsInfoToolTipOpen(true);
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
    setIsInfoToolTipOpen(false);
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

  useEffect(() => {
    if (loggedIn) {
      api.getUserInfo().then((userProfile) => {
        setCurrentUser(userProfile);
      });
      api
        .getInitialCards()
        .then((data) => {
          if (data) {
            setCards((cards) => [...cards, ...data]);
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [loggedIn]);

  function resetForm() {
    setEmail("");
    setPassword("");
  }

  function handleLogin() {
    setLoggedIn(true);
  }

  function handleLoginSubmit(e) {
    e.preventDefault();
    const [email, password] = [e.target.email.value, e.target.password.value];
    auth
      .authorize(email, password)
      .then((data) => {
        if (data && data.token) {
          handleLogin();
        } else {
          resetForm();
          if (!email || !password) {
            throw new Error(
              "400 - one or more of the fields were not provided"
            );
          }
          if (!data) {
            throw new Error(
              "401 - the user with the specified email not found"
            );
          }
        }
      })
      .then(resetForm)
      .then(() => history.push("/main"))
      .catch((err) => console.log(err.message));
  }

  function handleRegisterSubmit(e) {
    e.preventDefault();
    auth
      .register(email, password)
      .then((res) => {
        if (!res.data) {
          handleToolTip("error");
          throw new Error(`400 - ${res.message ? res.message : res.error}`);
        }
      })
      .then((res) => {
        setRegistered(true);
        history.push("/signin");
        return res;
      })
      .then((res) => {
        handleToolTip("success");
        return res;
      })
      .then(resetForm)
      .catch((err) => {
        console.log(err);
      });
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setLoggedIn(false);
    history.push("/signin");
  }

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      auth
        .getContent(token)
        .then((res) => {
          setLoggedIn(true);
          setUserEmail(res.data.email);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setLoggedIn(false);
    }
  }, [loggedIn, userEmail]);

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
            alignself="center"
          />
        </div>
        <p className="loading__text">Loading...</p>
        <Footer />
      </div>
    </div>
  ) : (
    <CurrentUserContext.Provider value={currentUser}>
      <Routes>
        <Route
          path="signin"
          element={
            <>
              <Header
                userEmail={userEmail}
                loggedIn={loggedIn}
                onLogout={handleLogout}
                link={"/signup"}
                description={"Sign up"}
              />
              <Login
                loggedIn={loggedIn}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                userEmail={setUserEmail}
                setUserEmail={setUserEmail}
                handleLogin={handleLogin}
                handleLoginSubmit={handleLoginSubmit}
                onLogout={handleLogout}
                isOpen={isInfoToolTipOpen}
                handleToolTip={handleToolTip}
                success={tooltipMode}
              />
              <InfoToolTip
                isOpen={isInfoToolTipOpen}
                success={tooltipMode}
                onClose={closeAllPopups}
                loggedIn={loggedIn}
              />
            </>
          }
        />
        <Route
          path="singup"
          element={
            <>
              <Header
                userEmail={userEmail}
                loggedIn={loggedIn}
                link={"/signin"}
                description={"Log in"}
              />
              <Register
                registered={registered}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                handleRegisterSubmit={handleRegisterSubmit}
                setUserEmail={setUserEmail}
                handleLogin={handleLogin}
                handleToolTip={handleToolTip}
              />
              <InfoToolTip
                isOpen={isInfoToolTipOpen}
                success={tooltipMode}
                onClose={closeAllPopups}
                loggedIn={loggedIn}
              />
            </>
          }
        />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Header
                loggedIn={loggedIn}
                userEmail={userEmail}
                link={"/signin"}
                description={"Log out"}
                onLogout={handleLogout}
              />
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
              <ImagePopup
                card={selectedCard}
                onClose={closeAllPopups}
              ></ImagePopup>
              <Footer />
            </ProtectedRoute>
          }
        />
      </Routes>
    </CurrentUserContext.Provider>
  );
}
