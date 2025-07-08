import { RefObject } from "react";

const CornerRadiusRatioInput = ({ 
  inputRef,
  cornerRadiusRatio, 
  setCornerRadiusRatio
}: {
  inputRef: RefObject<HTMLInputElement>
  cornerRadiusRatio: number;
  setCornerRadiusRatio: (cornerRadiusRatio: number) => void; 
}) => {

  const handleChange = () => {
    if (!inputRef.current) return;
    setCornerRadiusRatio(Number(inputRef.current.value));
  }

  return (
    <div className="c-control">
      <label 
        className="c-control__label"
        htmlFor="corner-radius-ratio-input">
        Corner radius ratio
      </label>
      <input
        ref={inputRef}
        className="c-control__input"
        id="corner-radius-ratio-input"
        value={cornerRadiusRatio}
        min={0}
        max={1}
        step={0.1}
        type="number"
        onChange={handleChange} />
    </div>
  );
};

export default CornerRadiusRatioInput;