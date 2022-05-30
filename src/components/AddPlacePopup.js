import React from "react";
import { useState } from "react";
import PopupWithForm from "./PopupWithForm";

export default function AddPlacePopup(props) {
  const [inputs, setInputs] = useState({});
  const [validation, setValidation] = useState({});
  const [isValid, setIsValid] = useState(false);

  React.useEffect(() => {
    setInputs("");
    if (!props.isOpen) setValidation({});
  }, [props.isOpen]);

  function handleinputs(event) {
    setInputs({
      ...inputs,
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
        inputs.name &&
        inputs.link &&
        !Object.values(validation).every((val) => Boolean(val));
      setIsValid(formIsValid || false);
    }
  }, [validation, inputs, props.isOpen]);

  function handleSubmit(evt) {
    evt.preventDefault();
    props.onAddPlaceSubmit({ name: inputs.name, link: inputs.link });
  }
  return (
    <PopupWithForm
      name="place"
      title="Add place"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      buttonText={props.buttonText}
      isValid={isValid}
    >
      <input
        id="place-title-input"
        name="name"
        type="text"
        placeholder="Title"
        className={`popup__input popup__input_field_heading ${
          isValid ? "" : "popup__input_type_error"
        }`}
        minLength="1"
        maxLength="30"
        required
        value={inputs.name || ""}
        onChange={handleinputs}
      />
      <span
        id="place-title-input-error"
        className={`${isValid ? "" : "popup__error_visible"}`}
      >
        {validation.name}
      </span>
      <input
        id="place-img-input"
        name="link"
        type="url"
        placeholder="Image Url"
        className={`popup__input popup__input_field_img ${
          isValid ? "" : "popup__input_type_error"
        }`}
        required
        value={inputs.link || ""}
        onChange={handleinputs}
      />
      <span
        id="place-img-input-error"
        className={`${isValid ? "" : "popup__error_visible"}`}
      >
        {validation.link}
      </span>
    </PopupWithForm>
  );
}
