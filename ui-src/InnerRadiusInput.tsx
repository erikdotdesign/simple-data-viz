import { RefObject } from "react";

const InnerRadiusInput = ({ 
  inputRef,
  innerRadius, 
  setInnerRadius 
}: {
  inputRef: RefObject<HTMLInputElement>
  innerRadius: number;
  setInnerRadius: (innerRadius: number) => void; 
}) => {

  const handleChange = () => {
    if (!inputRef.current) return;
    setInnerRadius(Number(inputRef.current.value));
  }

  return (
    <div className="c-control">
      <label 
        className="c-control__label"
        htmlFor="inner-radius-input">
        Inner ellipse radius
      </label>
      <input
        ref={inputRef}
        className="c-control__input"
        id="inner-radius-input"
        min={0}
        max={1}
        step={0.1}
        value={innerRadius}
        type="number"
        onChange={handleChange} />
    </div>
  );
};

export default InnerRadiusInput;