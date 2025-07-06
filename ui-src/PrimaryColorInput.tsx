import { RefObject } from "react";
import "./Control.css";

const PrimaryColorInput = ({ 
  inputRef, 
  primaryColor, 
  setPrimaryColor 
}: {
  inputRef: RefObject<HTMLInputElement>;
  primaryColor: string;
  setPrimaryColor: (primaryColor: string) => void;
}) => {

  const handleChange = () => {
    if (!inputRef.current) return;
    setPrimaryColor(inputRef.current.value);
  }

  return (
    <div className="c-control">
      <label 
        className="c-control__label"
        htmlFor="primary-color-input">
        Primary color
      </label>
      <input
        ref={inputRef}
        id="primary-color-input"
        className="c-control__input c-control__input--color"
        type="color"
        value={primaryColor}
        onChange={handleChange} />
    </div>
  );
}

export default PrimaryColorInput;