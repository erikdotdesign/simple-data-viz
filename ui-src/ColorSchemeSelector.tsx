import { RefObject } from "react";
import { ColorSchemeType } from "./types";
import { kebabToTitleCase } from "./helpers";
import SelectorIcon from "./SelectorIcon";
import "./Control.css";

const ColorSchemeSelector = ({ 
  inputRef, 
  colorScheme, 
  setColorScheme
}: {
  inputRef: RefObject<HTMLSelectElement>;
  colorScheme: ColorSchemeType,
  setColorScheme: (colorScheme: ColorSchemeType) => void;
}) => {

  const colorSchemeTypes: ColorSchemeType[] = [
    "monochrome",
    "polychrome"
  ];

  const handleChange = () => {
    if (!inputRef.current) return;
    setColorScheme(inputRef.current.value as ColorSchemeType);
  }

  return (
    <div className="c-control">
      <label 
        className="c-control__label"
        htmlFor="color-scheme-selector">
        Color scheme:
      </label>
      <select 
        ref={inputRef}
        id="color-scheme-selector"
        className="c-control__input"
        onChange={handleChange}
        value={colorScheme}>
        {
          colorSchemeTypes.map((type) => (
            <option 
              key={type}
              value={type}>
              { kebabToTitleCase(type) }
            </option>
          ))
        }
      </select>
      <SelectorIcon />
    </div>
  );
}

export default ColorSchemeSelector;