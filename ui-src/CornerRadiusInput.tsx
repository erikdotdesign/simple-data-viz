import { RefObject } from "react";

const CornerRadiusInput = ({ 
  inputRef,
  cornerRadius, 
  setCornerRadius 
}: {
  inputRef: RefObject<HTMLInputElement>
  cornerRadius: number;
  setCornerRadius: (cornerRadius: number) => void; 
}) => {

  const handleChange = () => {
    if (!inputRef.current) return;
    setCornerRadius(Number(inputRef.current.value));
  }

  return (
    <div className="c-control">
      <label 
        className="c-control__label"
        htmlFor="border-radius-input">
        Bar corner radius
      </label>
      <input
        ref={inputRef}
        className="c-control__input"
        id="border-radius-input"
        value={cornerRadius}
        type="number"
        onChange={handleChange} />
    </div>
  );
};

export default CornerRadiusInput;