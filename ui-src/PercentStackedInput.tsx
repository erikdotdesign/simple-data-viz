import { RefObject } from "react";

const PercentStackedInput = ({
  inputRef,
  percentStacked,
  setPercentStacked
}: {
  inputRef: RefObject<HTMLInputElement>;
  percentStacked: boolean;
  setPercentStacked: (percentStacked: boolean) => void;
}) => {

  const handleChange = () => {
    if (!inputRef.current) return;
    setPercentStacked(inputRef.current.checked);
  }

  return (
    <div className="c-control c-control--checkbox">
      <label 
        className="c-control__label"
        htmlFor="percent-stacked-input">
        Percent stacked
      </label>
      <input
        ref={inputRef}
        className="c-control__input"
        id="percent-stacked-input"
        type="checkbox"
        checked={percentStacked}
        onChange={handleChange} />
      <span className="c-control__checkmark" />
    </div>
  )
}

export default PercentStackedInput;