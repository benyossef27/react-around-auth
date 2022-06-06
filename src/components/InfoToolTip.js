export default function InfoToolTip(props) {
  return (
    <div
      className={`popup popup_type_${props.name} ${
        props.isOpen ? "popup_opened" : ""
      }`}
    >
      <div className="popup__container">
        <button
          className="popup__close"
          aria-label="popupclose"
          type="reset"
          onClick={props.onClose}
        ></button>
        <div
          className={`tooltip ${
            props.succes === "succes" ? "tooltip_succes" : "tooltip_error"
          } `}
        />
        <p className="tooltip-message">
          {props.succes === "succes"
            ? "succes! You have now been registared"
            : "Oops, somthing went wrong! Please try again"}
        </p>
      </div>
    </div>
  );
}
