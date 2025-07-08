import { RefObject, useEffect } from "react";
import uptrendBarChartCsv from '../sample_data/uptrend_bar_chart_data.csv?raw';
import downtrendBarChartCsv from '../sample_data/downtrend_bar_chart_data.csv?raw';
import flatBarChartCsv from '../sample_data/flat_bar_chart_data.csv?raw';
import uptrendGroupedBarChartCsv from '../sample_data/uptrend_grouped_bar_chart_data.csv?raw';
import downtrendGroupedBarChartCsv from '../sample_data/downtrend_grouped_bar_chart_data.csv?raw';
import flatGroupedBarChartCsv from '../sample_data/flat_grouped_bar_chart_data.csv?raw';
// import pieChartCsv from '../sample_data/pie_chart_data.csv?raw';
import uptrendLineChartCsv from '../sample_data/uptrend_line_chart_data.csv?raw';
import downtrendLineChartCsv from '../sample_data/downtrend_line_chart_data.csv?raw';
import flatLineChartCsv from '../sample_data/flat_line_chart_data.csv?raw';
import uptrendScatterChartCsv from '../sample_data/uptrend_scatter_chart_data.csv?raw';
import downtrendScatterChartCsv from '../sample_data/downtrend_scatter_chart_data.csv?raw';
import flatScatterChartCsv from '../sample_data/flat_scatter_chart_data.csv?raw';
import uptrendAreaChartCsv from '../sample_data/uptrend_area_chart_data.csv?raw';
import downtrendAreaChartCsv from '../sample_data/downtrend_area_chart_data.csv?raw';
import flatAreaChartCsv from '../sample_data/flat_area_chart_data.csv?raw';
// import stackedBarChartCsv from '../sample_data/stacked_bar_chart_data.csv?raw';
import { DataPresetType, ChartType } from "../types";
import { kebabToTitleCase } from "./helpers";
import SelectorIcon from "./SelectorIcon";
import "./Control.css";

const DataPresetSelector = ({ 
  inputRef, 
  dataPreset, 
  chartType,
  csvError,
  setCsvError,
  setCsvData,
  setDataPreset 
}: {
  inputRef: RefObject<HTMLSelectElement>;
  dataPreset: DataPresetType;
  chartType: ChartType;
  csvError: string | null;
  setCsvError: (csvError: string | null) => void;
  setCsvData: (csvData: string) => void;
  setDataPreset: (dataPreset: DataPresetType) => void;
}) => {

  const dataPresets: DataPresetType[] = [
    "uptrend",
    "downtrend",
    "flat"
  ];

  const handleChange = () => {
    if (!inputRef.current) return;
    setDataPreset(inputRef.current.value as DataPresetType);
  }

  const getChartData = () => {
    switch(chartType) {
      case "bar":
      case "column":
        return {
          uptrend: uptrendBarChartCsv,
          downtrend: downtrendBarChartCsv,
          flat: flatBarChartCsv
        }
      case "grouped-bar":
      case "grouped-column":
        return {
          uptrend: uptrendGroupedBarChartCsv,
          downtrend: downtrendGroupedBarChartCsv,
          flat: flatGroupedBarChartCsv
        }
      case "area":
        return {
          uptrend: uptrendAreaChartCsv,
          downtrend: downtrendAreaChartCsv,
          flat: flatAreaChartCsv
        }
      case "line":
        return {
          uptrend: uptrendLineChartCsv,
          downtrend: downtrendLineChartCsv,
          flat: flatLineChartCsv
        }
      case "scatter":
        return {
          uptrend: uptrendScatterChartCsv,
          downtrend: downtrendScatterChartCsv,
          flat: flatScatterChartCsv
        }
    }
  }

  const handleChartSwitch = () => {
    if (csvError) setCsvError(null);
    const presetData = hasPresets() && getChartData()[dataPreset];
    if (presetData) setCsvData(presetData);
  }

  const hasPresets = () => !!getChartData();

  useEffect(() => {
    handleChartSwitch();
  }, [chartType, dataPreset]);

  return (
    <div className="c-control">
      <label 
        className="c-control__label"
        htmlFor="data-preset-selector">
        Data preset
      </label>
      <select 
        ref={inputRef}
        id="data-preset-selector"
        className="c-control__input"
        onChange={handleChange}
        value={hasPresets() ? dataPreset : ""}>
        <option 
          value="" 
          disabled 
          hidden>
          { hasPresets() ? "Select a preset..." : "No presets available" }
        </option>
        {
          hasPresets() && dataPresets.map((type) => (
            <option key={type} value={type}>
              { kebabToTitleCase(type) }
            </option>
          ))
        }
      </select>
      <SelectorIcon />
    </div>
  );
}

export default DataPresetSelector;