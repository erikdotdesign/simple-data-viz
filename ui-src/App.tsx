import { useRef, useState } from "react";
import "./App.css";
import { ChartType } from "./types";
import ChartSelector from "./ChartSelector";
import PrimaryColorInput from "./PrimaryColorInput";
import CsvInput from "./CsvInput";
import GenerateButton from "./GenerateButton";

const App = () => {
  const chartTypeRef = useRef<HTMLSelectElement>(null);
  const primaryColorRef = useRef<HTMLInputElement>(null);
  const csvDataRef = useRef<HTMLTextAreaElement>(null);
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [primaryColor, setPrimaryColor] = useState<string>("#ff0000");
  const [csvData, setCsvData] = useState<string>("");
  const [csvError, setCsvError] = useState<string | null>(null);

  return (
    <main className="c-app">
      <ChartSelector 
        inputRef={chartTypeRef}
        chartType={chartType}
        setChartType={setChartType} />
      <PrimaryColorInput
        inputRef={primaryColorRef}
        primaryColor={primaryColor}
        setPrimaryColor={setPrimaryColor} />
      <CsvInput
        inputRef={csvDataRef}
        csvData={csvData}
        chartType={chartType}
        setCsvData={setCsvData}
        csvError={csvError}
        setCsvError={setCsvError} />
      <GenerateButton
        csvData={csvData}
        primaryColor={primaryColor}
        chartType={chartType}
        csvError={csvError} />
    </main>
  );
}

export default App;