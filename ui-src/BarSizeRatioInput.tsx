import { RefObject } from "react";

const BarSizeRatioInput = ({ 
  inputRef,
  barSizeRatio, 
  setBarSizeRatio 
}: {
  inputRef: RefObject<HTMLInputElement>
  barSizeRatio: number;
  setBarSizeRatio: (barSizeRatio: number) => void; 
}) => {

  const handleChange = () => {
    if (!inputRef.current) return;
    setBarSizeRatio(Number(inputRef.current.value));
  }

  return (
    <div className="c-control">
      <label 
        className="c-control__label"
        htmlFor="bar-size-ratio-input">
        Size ratio
      </label>
      <input
        ref={inputRef}
        className="c-control__input"
        id="bar-size-ratio-input"
        min={0}
        max={1}
        step={0.1}
        value={barSizeRatio}
        type="number"
        onChange={handleChange} />
    </div>
  );
};

export default BarSizeRatioInput;