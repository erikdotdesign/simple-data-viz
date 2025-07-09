import { RefObject, useEffect } from "react";
// bar/column
import randomBarChartCsv from '../sample_data/bar/random.csv?raw';
import uptrendBarChartCsv from '../sample_data/bar/uptrend.csv?raw';
import downtrendBarChartCsv from '../sample_data/bar/downtrend.csv?raw';
import flatBarChartCsv from '../sample_data/bar/flat.csv?raw';
// grouped bar/column
import randomGroupedBarChartCsv from '../sample_data/grouped-bar/random.csv?raw';
import uptrendGroupedBarChartCsv from '../sample_data/grouped-bar/uptrend.csv?raw';
import downtrendGroupedBarChartCsv from '../sample_data/grouped-bar/downtrend.csv?raw';
import flatGroupedBarChartCsv from '../sample_data/grouped-bar/flat.csv?raw';
// pie
import randomPieChartCsv from '../sample_data/pie/random.csv?raw';
import balancedPieChartCsv from '../sample_data/pie/balanced.csv?raw';
import dominantPieChartCsv from '../sample_data/pie/dominant.csv?raw';
import longTailPieChartCsv from '../sample_data/pie/long-tail.csv?raw';
import binaryPieChartCsv from '../sample_data/pie/binary.csv?raw';
// line
import randomLineChartCsv from '../sample_data/line/random.csv?raw';
import uptrendLineChartCsv from '../sample_data/line/uptrend.csv?raw';
import downtrendLineChartCsv from '../sample_data/line/downtrend.csv?raw';
import flatLineChartCsv from '../sample_data/line/flat.csv?raw';
// scatter
import randomScatterChartCsv from '../sample_data/scatter/random.csv?raw';
import uptrendScatterChartCsv from '../sample_data/scatter/uptrend.csv?raw';
import downtrendScatterChartCsv from '../sample_data/scatter/downtrend.csv?raw';
import flatScatterChartCsv from '../sample_data/scatter/flat.csv?raw';
// area
import randomAreaChartCsv from '../sample_data/area/random.csv?raw';
import uptrendAreaChartCsv from '../sample_data/area/uptrend.csv?raw';
import downtrendAreaChartCsv from '../sample_data/area/downtrend.csv?raw';
import flatAreaChartCsv from '../sample_data/area/flat.csv?raw';
// stacked bar
import randomStackedBarChartCsv from '../sample_data/stacked-bar/random.csv?raw';
import uptrendStackedBarChartCsv from '../sample_data/stacked-bar/uptrend.csv?raw';
import downtrendStackedBarChartCsv from '../sample_data/stacked-bar/downtrend.csv?raw';
import flatStackedBarChartCsv from '../sample_data/stacked-bar/flat.csv?raw';
import dominantStackedBarChartCsv from '../sample_data/stacked-bar/dominant.csv?raw';
import shiftingStackedBarChartCsv from '../sample_data/stacked-bar/shifting.csv?raw';
// candlestick
import randomCandlestickChartCsv from '../sample_data/candlestick/random.csv?raw';
import uptrendCandlestickChartCsv from '../sample_data/candlestick/uptrend.csv?raw';
import downtrendCandlestickChartCsv from '../sample_data/candlestick/downtrend.csv?raw';
import flatCandlestickChartCsv from '../sample_data/candlestick/flat.csv?raw';
import { DataPresetType, ChartType } from "../types";
import { camelCaseToTitleCase } from "./helpers";
import SelectorIcon from "./SelectorIcon";
import "./Control.css";

const DataPresetSelector = ({ 
  inputRef, 
  fileInputRef,
  dataPreset, 
  chartType,
  csvError,
  setCsvError,
  setCsvData,
  setDataPreset 
}: {
  inputRef: RefObject<HTMLSelectElement>;
  fileInputRef: RefObject<HTMLInputElement>;
  dataPreset: DataPresetType;
  chartType: ChartType;
  csvError: string | null;
  setCsvError: (csvError: string | null) => void;
  setCsvData: (csvData: string) => void;
  setDataPreset: (dataPreset: DataPresetType) => void;
}) => {

  const handleChange = () => {
    if (!inputRef.current) return;
    if (inputRef.current.value === "__file__") {
      fileInputRef.current?.click();
      return;
    }
    setDataPreset(inputRef.current.value as DataPresetType);
  }

  const getChartData = () => {
    switch(chartType) {
      case "bar":
      case "column":
        return {
          random: randomBarChartCsv,
          uptrend: uptrendBarChartCsv,
          downtrend: downtrendBarChartCsv,
          flat: flatBarChartCsv
        }
      case "grouped-bar":
      case "grouped-column":
        return {
          random: randomGroupedBarChartCsv,
          uptrend: uptrendGroupedBarChartCsv,
          downtrend: downtrendGroupedBarChartCsv,
          flat: flatGroupedBarChartCsv
        }
      case "stacked-bar":
      case "stacked-column":
        return {
          random: randomStackedBarChartCsv,
          uptrend: uptrendStackedBarChartCsv,
          downtrend: downtrendStackedBarChartCsv,
          flat: flatStackedBarChartCsv,
          dominant: dominantStackedBarChartCsv,
          shifting: shiftingStackedBarChartCsv,
        }
      case "pie":
      case "donut":
        return {
          random: randomPieChartCsv,
          balanced: balancedPieChartCsv,
          dominant: dominantPieChartCsv,
          longTail: longTailPieChartCsv,
          binary: binaryPieChartCsv,
        }
      case "area":
      case "stacked-area":
      case "multi-line":
        return {
          random: randomAreaChartCsv,
          uptrend: uptrendAreaChartCsv,
          downtrend: downtrendAreaChartCsv,
          flat: flatAreaChartCsv
        }
      case "line":
        return {
          random: randomLineChartCsv,
          uptrend: uptrendLineChartCsv,
          downtrend: downtrendLineChartCsv,
          flat: flatLineChartCsv
        }
      case "scatter":
      case "bubble":
        return {
          random: randomScatterChartCsv,
          uptrend: uptrendScatterChartCsv,
          downtrend: downtrendScatterChartCsv,
          flat: flatScatterChartCsv
        }
      case "candlestick":
        return {
          random: randomCandlestickChartCsv,
          uptrend: uptrendCandlestickChartCsv,
          downtrend: downtrendCandlestickChartCsv,
          flat: flatCandlestickChartCsv
        }
    }
  }

  const handleChartSwitch = () => {
    if (dataPreset !== "") {
      if (csvError) setCsvError(null);
      const presetData = getChartData()[dataPreset];
      if (presetData) {
        setCsvData(presetData);
      } else {
        setDataPreset("random");
      }
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
          -- Select a preset --
        </option>
        {
          Object.keys(getChartData()).map((type) => (
            <option key={type} value={type}>
              { camelCaseToTitleCase(type) }
            </option>
          ))
        }
        <option 
          value="__file__">
          Import CSV file
        </option>
      </select>
      <SelectorIcon />
    </div>
  );
}

export default DataPresetSelector;