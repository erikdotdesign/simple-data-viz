import { RefObject } from "react";
import { ChartType } from "./types";
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

  const handleChange = () => {
    if (inputRef.current) {
      setChartType(inputRef.current.value as ChartType);
    }
  }

  return (
    <div className="c-control">
      <label className="c-control__label">
        Chart Type:
      </label>
      <select 
        ref={inputRef}
        id="chart-type"
        className="c-control__input"
        onChange={handleChange}
        value={chartType}>
        <option value="bar">Bar</option>
        <option value="column">Column</option>
        <option value="grouped-bar">Grouped Bar</option>
        <option value="grouped-column">Grouped Column</option>
        <option value="line">Line</option>
        <option value="pie">Pie</option>
        <option value="scatter">Scatter</option>
      </select>
    </div>
  );
}

export default ChartSelector;