import { RefObject, useEffect } from "react";
import barChartCsv from '../sample_data/bar_chart_data.csv?raw';
import groupedBarChartCsv from '../sample_data/grouped_bar_chart_data.csv?raw';
import pieChartCsv from '../sample_data/pie_chart_data.csv?raw';
import lineChartCsv from '../sample_data/line_chart_data.csv?raw';
import scatterChartCsv from '../sample_data/scatter_chart_data.csv?raw';
import areaChartCsv from '../sample_data/area_chart_data.csv?raw';
import stackedBarChartCsv from '../sample_data/stacked_bar_chart_data.csv?raw';
import { ChartType } from "../types";
import { kebabToTitleCase } from "./helpers";
import SelectorIcon from "./SelectorIcon";
import "./Control.css";

const ChartSelector = ({ 
  inputRef, 
  chartType, 
  csvError,
  setCsvError,
  setCsvData,
  setChartType 
}: {
  inputRef: RefObject<HTMLSelectElement>;
  chartType: ChartType;
  csvError: string | null;
  setCsvError: (csvError: string | null) => void;
  setCsvData: (csvData: string) => void;
  setChartType: (chartType: ChartType) => void;
}) => {

  const chartTypes: ChartType[] = [
    "bar",
    "column",
    "grouped-bar",
    "grouped-column",
    "stacked-bar",
    "stacked-column",
    "pie",
    "donut",
    "line",
    "area",
    "scatter"
  ];

  const handleChange = () => {
    if (!inputRef.current) return;
    setChartType(inputRef.current.value as ChartType);
  }

  const handleChartSwitch = () => {
    if (csvError) setCsvError(null);
    switch(chartType) {
      case "bar":
      case "column":
        setCsvData(barChartCsv);
        break;
      case "grouped-bar":
      case "grouped-column":
        setCsvData(groupedBarChartCsv);
        break;
      case "stacked-bar":
      case "stacked-column":
        setCsvData(stackedBarChartCsv);
        break;
      case "pie":
      case "donut":
        setCsvData(pieChartCsv);
        break;
      case "line":
        setCsvData(lineChartCsv);
        break;
      case "area":
        setCsvData(areaChartCsv);
        break;
      case "scatter":
        setCsvData(scatterChartCsv);
        break;
    }
  }

  useEffect(() => {
    handleChartSwitch();
  }, [chartType]);

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