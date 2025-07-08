import { RefObject } from "react";

const CornerRadiusRatioInput = ({ 
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
        htmlFor="corner-radius-input">
        Corner radius
      </label>
      <input
        ref={inputRef}
        className="c-control__input"
        id="corner-radius-input"
        value={cornerRadius}
        min={0}
        step={1}
        type="number"
        onChange={handleChange} />
    </div>
  );
};

export default CornerRadiusRatioInput;