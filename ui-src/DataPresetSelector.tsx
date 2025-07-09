import { RefObject, useEffect } from "react";
// bar/column
import uptrendBarChartCsv from '../sample_data/bar/uptrend.csv?raw';
import downtrendBarChartCsv from '../sample_data/bar/downtrend.csv?raw';
import flatBarChartCsv from '../sample_data/bar/flat.csv?raw';
// grouped bar/column
import uptrendGroupedBarChartCsv from '../sample_data/grouped-bar/uptrend.csv?raw';
import downtrendGroupedBarChartCsv from '../sample_data/grouped-bar/downtrend.csv?raw';
import flatGroupedBarChartCsv from '../sample_data/grouped-bar/flat.csv?raw';
// pie
import balancedPieChartCsv from '../sample_data/pie/balanced.csv?raw';
import dominantPieChartCsv from '../sample_data/pie/dominant.csv?raw';
import longTailPieChartCsv from '../sample_data/pie/long-tail.csv?raw';
import binaryPieChartCsv from '../sample_data/pie/binary.csv?raw';
// line
import uptrendLineChartCsv from '../sample_data/line/uptrend.csv?raw';
import downtrendLineChartCsv from '../sample_data/line/downtrend.csv?raw';
import flatLineChartCsv from '../sample_data/line/flat.csv?raw';
// scatter
import uptrendScatterChartCsv from '../sample_data/scatter/uptrend.csv?raw';
import downtrendScatterChartCsv from '../sample_data/scatter/downtrend.csv?raw';
import flatScatterChartCsv from '../sample_data/scatter/flat.csv?raw';
// area
import uptrendAreaChartCsv from '../sample_data/area/uptrend.csv?raw';
import downtrendAreaChartCsv from '../sample_data/area/downtrend.csv?raw';
import flatAreaChartCsv from '../sample_data/area/flat.csv?raw';
// stacked bar
import uptrendStackedBarChartCsv from '../sample_data/stacked-bar/uptrend.csv?raw';
import downtrendStackedBarChartCsv from '../sample_data/stacked-bar/downtrend.csv?raw';
import flatStackedBarChartCsv from '../sample_data/stacked-bar/flat.csv?raw';
import dominantStackedBarChartCsv from '../sample_data/stacked-bar/dominant.csv?raw';
import shiftingStackedBarChartCsv from '../sample_data/stacked-bar/shifting.csv?raw';
// candlestick
import uptrendCandlestickChartCsv from '../sample_data/candlestick/uptrend.csv?raw';
import downtrendCandlestickChartCsv from '../sample_data/candlestick/downtrend.csv?raw';
import flatCandlestickChartCsv from '../sample_data/candlestick/flat.csv?raw';
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
      case "candlestick":
        return {
          uptrend: uptrendCandlestickChartCsv,
          downtrend: downtrendCandlestickChartCsv,
          flat: flatCandlestickChartCsv
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