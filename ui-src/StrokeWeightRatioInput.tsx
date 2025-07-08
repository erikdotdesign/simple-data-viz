import { RefObject } from "react";

const StrokeWeightRatioInput = ({ 
  inputRef,
  strokeWeightRatio, 
  setStrokeWeightRatio 
}: {
  inputRef: RefObject<HTMLInputElement>
  strokeWeightRatio: number;
  setStrokeWeightRatio: (strokeWeightRatio: number) => void; 
}) => {

  const handleChange = () => {
    if (!inputRef.current) return;
    setStrokeWeightRatio(Number(inputRef.current.value));
  }

  return (
    <div className="c-control">
      <label 
        className="c-control__label"
        htmlFor="stroke-weight-ratio-input">
        Stroke weight ratio
      </label>
      <input
        ref={inputRef}
        className="c-control__input"
        id="stroke-weight-ratio-input"
        min={0.001}
        max={1}
        step={0.001}
        value={strokeWeightRatio}
        type="number"
        onChange={handleChange} />
    </div>
  );
};

export default StrokeWeightRatioInput;