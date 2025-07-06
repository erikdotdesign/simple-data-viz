import { RefObject } from "react";

const BottomFillInput = ({
  inputRef,
  bottomFill,
  setBottomFill
}: {
  inputRef: RefObject<HTMLInputElement>;
  bottomFill: boolean;
  setBottomFill: (bottomFill: boolean) => void;
}) => {

  const handleChange = () => {
    if (!inputRef.current) return;
    setBottomFill(inputRef.current.checked);
  }

  return (
    <div className="c-control c-control--checkbox">
      <label 
        className="c-control__label"
        htmlFor="bottom-fill-input">
        Bottom fill
      </label>
      <input
        ref={inputRef}
        className="c-control__input"
        id="bottom-fill-input"
        type="checkbox"
        checked={bottomFill}
        onChange={handleChange} />
      <span className="c-control__checkmark" />
    </div>
  )
}

export default BottomFillInput;