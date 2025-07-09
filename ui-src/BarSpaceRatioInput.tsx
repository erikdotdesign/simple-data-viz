import { RefObject } from "react";

const BarSpaceRatioInput = ({ 
  inputRef,
  barSpaceRatio, 
  setBarSpaceRatio 
}: {
  inputRef: RefObject<HTMLInputElement>;
  barSpaceRatio: number;
  setBarSpaceRatio: (barSpaceRatio: number) => void; 
}) => {

  const handleChange = () => {
    if (!inputRef.current) return;
    setBarSpaceRatio(Number(inputRef.current.value));
  }

  return (
    <div className="c-control">
      <label 
        className="c-control__label"
        htmlFor="bar-space-ratio-input">
        Space ratio
      </label>
      <input
        ref={inputRef}
        className="c-control__input"
        id="bar-space-ratio-input"
        min={0}
        max={1}
        step={0.1}
        value={barSpaceRatio}
        type="number"
        onChange={handleChange} />
    </div>
  );
};

export default BarSpaceRatioInput;