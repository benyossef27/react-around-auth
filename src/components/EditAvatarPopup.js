import React from "react";
import { useState } from "react";
import PopupWithForm from "./PopupWithForm";

export default function EditAvatarPopup(props) {
  const [inputs, setInputs] = useState("");
  const [validation, setValidation] = useState({});
  const [isValid, setIsValid] = useState(false);

  React.useEffect(() => {
    setInputs("");
    if (!props.isOpen) setValidation({});
  }, [props.isOpen]);

  function handleinputs(event) {
    setInputs({
      inputs,
      [event.target.name]: event.target.value,
    });
    setValidation({
      ...validation,
      [event.target.name]: event.target.validationMessage,
    });
  }

  React.useEffect(() => {
    if (props.isOpen) {
      const formIsValid =
        inputs && !Object.values(validation).every((val) => Boolean(val));
      setIsValid(formIsValid || false);
    }
  }, [validation, inputs, props.isOpen]);

  const avatarRef = React.useRef("");
  function handleSubmit(e) {
    e.preventDefault();
    props.onUpdateAvatar({
      avatar: avatarRef.current.value,
    });
  }

  return (
    <PopupWithForm
      name="avatar"
      title="Edit avatar"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      buttonText={props.buttonText}
      isValid={isValid}
    >
      <input
        id="avatar-img-input"
        name="link"
        type="url"
        placeholder="Image Url"
        className={`popup__input popup__input_field_img ${
          isValid ? "" : "popup__input_type_error"
        }`}
        required
        ref={avatarRef}
        value={inputs.link || ""}
        onChange={handleinputs}
      />
      <span
        id="avatar-img-input-error"
        className={`${isValid ? "" : "popup__error_visible"}`}
      >
        {validation.link}
      </span>
    </PopupWithForm>
  );
}
