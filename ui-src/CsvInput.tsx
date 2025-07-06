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
  setCsvData
}: {
  inputRef: RefObject<HTMLTextAreaElement>;
  csvData: string;
  chartType: ChartType;
  setCsvData: (csvData: string) => void;
}) => {

  const handleChange = () => {
    if (inputRef.current) {
      setCsvData(inputRef.current.value);
    }
  }

  useEffect(() => {
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
  }, [chartType]);

  return (
    <div className="c-control">
      <label className="c-control__label">
        Paste CSV data (label,value):
      </label>
      <textarea 
        id="data-input"
        className="c-control__input c-control__input--textarea"
        ref={inputRef}
        onChange={handleChange}
        value={csvData} />
    </div>
  );
}

export default CsvInput;