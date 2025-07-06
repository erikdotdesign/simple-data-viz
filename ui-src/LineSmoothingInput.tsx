import { RefObject } from "react";

const LineSmoothingInput = ({
  inputRef,
  lineSmoothing,
  setLineSmoothing
}: {
  inputRef: RefObject<HTMLInputElement>;
  lineSmoothing: boolean;
  setLineSmoothing: (lineSmoothing: boolean) => void;
}) => {

  const handleChange = () => {
    if (!inputRef.current) return;
    setLineSmoothing(inputRef.current.checked);
  }

  return (
    <div className="c-control c-control--checkbox">
      <label 
        className="c-control__label"
        htmlFor="smooth-line-input">
        Line smoothing
      </label>
      <input
        ref={inputRef}
        className="c-control__input"
        id="smooth-line-input"
        type="checkbox"
        checked={lineSmoothing}
        onChange={handleChange} />
      <span className="c-control__checkmark" />
    </div>
  )
}

export default LineSmoothingInput;