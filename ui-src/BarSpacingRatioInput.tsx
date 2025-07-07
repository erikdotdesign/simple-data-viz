import { RefObject } from "react";

const BarSpacingRatioInput = ({ 
  inputRef,
  barSpacingRatio, 
  setBarSpacingRatio 
}: {
  inputRef: RefObject<HTMLInputElement>
  barSpacingRatio: number;
  setBarSpacingRatio: (barSpacingRatio: number) => void; 
}) => {

  const handleChange = () => {
    if (!inputRef.current) return;
    setBarSpacingRatio(Number(inputRef.current.value));
  }

  return (
    <div className="c-control">
      <label 
        className="c-control__label"
        htmlFor="bar-spacing-ratio-input">
        Spacing ratio
      </label>
      <input
        ref={inputRef}
        className="c-control__input"
        id="bar-spacing-ratio-input"
        min={0}
        max={1}
        step={0.1}
        value={barSpacingRatio}
        type="number"
        onChange={handleChange} />
    </div>
  );
};

export default BarSpacingRatioInput;