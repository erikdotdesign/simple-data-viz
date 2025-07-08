import { RefObject } from "react";

const StrokeWeightInput = ({ 
  inputRef,
  strokeWeight, 
  setStrokeWeight 
}: {
  inputRef: RefObject<HTMLInputElement>
  strokeWeight: number;
  setStrokeWeight: (strokeWeight: number) => void; 
}) => {

  const handleChange = () => {
    if (!inputRef.current) return;
    setStrokeWeight(Number(inputRef.current.value));
  }

  return (
    <div className="c-control">
      <label 
        className="c-control__label"
        htmlFor="stroke-weight-input">
        Stroke weight
      </label>
      <input
        ref={inputRef}
        className="c-control__input"
        id="stroke-weight-input"
        min={0}
        step={1}
        value={strokeWeight}
        type="number"
        onChange={handleChange} />
    </div>
  );
};

export default StrokeWeightInput;