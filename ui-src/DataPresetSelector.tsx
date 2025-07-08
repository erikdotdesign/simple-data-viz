import { RefObject, useEffect } from "react";
// bar/column
import uptrendBarChartCsv from '../sample_data/uptrend_bar_chart_data.csv?raw';
import downtrendBarChartCsv from '../sample_data/downtrend_bar_chart_data.csv?raw';
import flatBarChartCsv from '../sample_data/flat_bar_chart_data.csv?raw';
// grouped bar/column
import uptrendGroupedBarChartCsv from '../sample_data/uptrend_grouped_bar_chart_data.csv?raw';
import downtrendGroupedBarChartCsv from '../sample_data/downtrend_grouped_bar_chart_data.csv?raw';
import flatGroupedBarChartCsv from '../sample_data/flat_grouped_bar_chart_data.csv?raw';
// pie
import balancedPieChartCsv from '../sample_data/balanced_pie_chart_data.csv?raw';
import dominantPieChartCsv from '../sample_data/dominant_pie_chart_data.csv?raw';
import longTailPieChartCsv from '../sample_data/long-tail_pie_chart_data.csv?raw';
import binaryPieChartCsv from '../sample_data/binary_pie_chart_data.csv?raw';
// line
import uptrendLineChartCsv from '../sample_data/uptrend_line_chart_data.csv?raw';
import downtrendLineChartCsv from '../sample_data/downtrend_line_chart_data.csv?raw';
import flatLineChartCsv from '../sample_data/flat_line_chart_data.csv?raw';
// scatter
import uptrendScatterChartCsv from '../sample_data/uptrend_scatter_chart_data.csv?raw';
import downtrendScatterChartCsv from '../sample_data/downtrend_scatter_chart_data.csv?raw';
import flatScatterChartCsv from '../sample_data/flat_scatter_chart_data.csv?raw';
// area
import uptrendAreaChartCsv from '../sample_data/uptrend_area_chart_data.csv?raw';
import downtrendAreaChartCsv from '../sample_data/downtrend_area_chart_data.csv?raw';
import flatAreaChartCsv from '../sample_data/flat_area_chart_data.csv?raw';
// stacked bar
import uptrendStackedBarChartCsv from '../sample_data/uptrend_stacked_bar_chart_data.csv?raw';
import downtrendStackedBarChartCsv from '../sample_data/downtrend_stacked_bar_chart_data.csv?raw';
import flatStackedBarChartCsv from '../sample_data/flat_stacked_bar_chart_data.csv?raw';
import dominantStackedBarChartCsv from '../sample_data/dominant_stacked_bar_chart_data.csv?raw';
import shiftingStackedBarChartCsv from '../sample_data/shifting_stacked_bar_chart_data.csv?raw';
import { DataPresetType, ChartType } from "../types";
import { camelCaseToTitleCase } from "./helpers";
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
      case "stacked-bar":
      case "stacked-column":
        return {
          uptrend: uptrendStackedBarChartCsv,
          downtrend: downtrendStackedBarChartCsv,
          flat: flatStackedBarChartCsv,
          dominant: dominantStackedBarChartCsv,
          shifting: shiftingStackedBarChartCsv,
        }
      case "pie":
      case "donut":
        return {
          balanced: balancedPieChartCsv,
          dominant: dominantPieChartCsv,
          longTail: longTailPieChartCsv,
          binary: binaryPieChartCsv,
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
    const presetData = getChartData()[dataPreset];
    if (presetData) {
      if (csvError) setCsvError(null);
      setCsvData(presetData);
    }
  }

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
        value={dataPreset in getChartData() ? dataPreset : ""}>
        <option 
          value="" 
          disabled>
          Select a preset...
        </option>
        {
          Object.keys(getChartData()).map((type) => (
            <option key={type} value={type}>
              { camelCaseToTitleCase(type) }
            </option>
          ))
        }
      </select>
      <SelectorIcon />
    </div>
  );
}

export default DataPresetSelector;