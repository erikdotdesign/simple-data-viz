import papaParse from "papaparse";
import barChartCsv from '../sample_data/bar_chart_data.csv?raw';
import groupedBarChartCsv from '../sample_data/grouped_bar_chart_data.csv?raw';
import pieChartCsv from '../sample_data/pie_chart_data.csv?raw';
import lineChartCsv from '../sample_data/line_chart_data.csv?raw';
import scatterChartCsv from '../sample_data/scatter_chart_data.csv?raw';
import { RefObject, useEffect } from "react";
import { ChartType } from "./types";
import "./Control.css";

const CsvInput = ({ 
  inputRef, 
  csvData, 
  chartType,
  csvError,
  setCsvData,
  setCsvError
}: {
  inputRef: RefObject<HTMLTextAreaElement>;
  csvData: string;
  chartType: ChartType;
  csvError: string | null;
  setCsvData: (csvData: string) => void;
  setCsvError: (csvError: string | null) => void;
}) => {

  const handleChange = () => {
    if (!inputRef.current) return;

    const value = inputRef.current.value;

    const parsed = papaParse.parse(value.trim(), {
      dynamicTyping: true,
      skipEmptyLines: true
    });

    setCsvData(value);

    if (parsed.errors.length) {
      setCsvError(`${parsed.errors[0].type}: ${parsed.errors[0].message}`);
    } else {
      if (csvError) setCsvError(null);
    }
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
      case "pie":
        setCsvData(pieChartCsv);
        break;
      case "line":
        setCsvData(lineChartCsv);
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
    <div className={`c-control ${csvError ? 'c-control--error' : ''}`}>
      <label 
        className="c-control__label"
        htmlFor="csv-input">
        Paste or edit CSV data (label, value)
      </label>
      <textarea 
        id="csv-input"
        className="c-control__input c-control__input--textarea"
        ref={inputRef}
        onChange={handleChange}
        value={csvData} />
      <div className="c-control__message">
        { csvError }
      </div>
    </div>
  );
}

export default CsvInput;