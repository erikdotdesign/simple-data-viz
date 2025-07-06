import { RefObject } from "react";
import { ChartType } from "./types";
import { kebabToTitleCase } from "./helpers";
import SelectorIcon from "./SelectorIcon";
import "./Control.css";

const ChartSelector = ({ 
  inputRef, 
  chartType, 
  setChartType 
}: {
  inputRef: RefObject<HTMLSelectElement>;
  chartType: ChartType,
  setChartType: (chartType: ChartType) => void;
}) => {

  const chartTypes: ChartType[] = [
    "bar",
    "column",
    "grouped-bar",
    "grouped-column",
    "line",
    "pie",
    "donut",
    "scatter"
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

export default ChartSelector;