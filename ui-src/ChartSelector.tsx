import { RefObject } from "react";
import { ChartType } from "../types";
import { kebabToTitleCase } from "./helpers";
import SelectorIcon from "./SelectorIcon";
import "./Control.css";

const ChartSelector = ({ 
  inputRef, 
  chartType,
  setChartType 
}: {
  inputRef: RefObject<HTMLSelectElement>;
  chartType: ChartType;
  setChartType: (chartType: ChartType) => void;
}) => {

  const chartTypes: [string, ChartType[]][] = [
    ["bar", ["bar", "grouped-bar", "stacked-bar"]],
    ["column", ["column", "grouped-column", "stacked-column"]],
    ["pie", ["pie", "donut"]],
    ["line", ["line", "multi-line"]],
    ["area", ["area", "stacked-area"]],
    ["scatter", ["scatter", "bubble"]],
    ["other", ["radar", "candlestick"]]
  ];

  const handleChange = () => {
    if (!inputRef.current) return;
    setChartType(inputRef.current.value as ChartType);
  }

  return (
    <div className="c-control">
      <label 
        className="c-control__label"
        htmlFor="chart-selector">
        Chart type
      </label>
      <select 
        ref={inputRef}
        id="chart-selector"
        className="c-control__input"
        onChange={handleChange}
        value={chartType}>
        {
          chartTypes.map((type) => (
            <optgroup label={`${kebabToTitleCase(type[0])}`}>
              {
                type[1].map((t) => (
                  <option 
                    key={t}
                    value={t}>
                    { kebabToTitleCase(t) }
                  </option>
                ))
              }
            </optgroup>
          ))
        }
      </select>
      <SelectorIcon />
    </div>
  );
}

export default ChartSelector;