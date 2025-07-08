import { RefObject } from "react";

const PointRadiusRatioInput = ({ 
  inputRef,
  pointRadiusRatio, 
  setPointRadiusRatio 
}: {
  inputRef: RefObject<HTMLInputElement>
  pointRadiusRatio: number;
  setPointRadiusRatio: (pointRadiusRatio: number) => void; 
}) => {

  const handleChange = () => {
    if (!inputRef.current) return;
    setPointRadiusRatio(Number(inputRef.current.value));
  }

  return (
    <div className="c-control">
      <label 
        className="c-control__label"
        htmlFor="point-radius-ratio-input">
        Point radius ratio
      </label>
      <input
        ref={inputRef}
        className="c-control__input"
        id="point-radius-ratio-input"
        min={0.01}
        max={1}
        step={0.01}
        value={pointRadiusRatio}
        type="number"
        onChange={handleChange} />
    </div>
  );
};

export default PointRadiusRatioInput;