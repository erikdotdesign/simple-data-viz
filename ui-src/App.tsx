import { useRef, useState } from "react";
import "./App.css";
import { ChartType, ColorSchemeType } from "./types";
import ChartSelector from "./ChartSelector";
import PrimaryColorInput from "./PrimaryColorInput";
import CsvInput from "./CsvInput";
import GenerateButton from "./GenerateButton";
import ColorSchemeSelector from "./ColorSchemeSelector";
import LineSmoothingInput from "./LineSmoothingInput";
import CornerRadiusInput from "./CornerRadiusInput";
import InnerRadiusInput from "./InnerRadiusInput";
import BottomFillInput from "./BottomFillInput";
import Logo from "./Logo";

const App = () => {
  const chartTypeRef = useRef<HTMLSelectElement>(null);
  const colorSchemeRef = useRef<HTMLSelectElement>(null);
  const primaryColorRef = useRef<HTMLInputElement>(null);
  const csvDataRef = useRef<HTMLTextAreaElement>(null);
  const lineSmoothingRef = useRef<HTMLInputElement>(null);
  const cornerRadiusRef = useRef<HTMLInputElement>(null);
  const innerRadiusRef = useRef<HTMLInputElement>(null);
  const bottomFillRef = useRef<HTMLInputElement>(null);
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [colorScheme, setColorScheme] = useState<ColorSchemeType>("monochrome");
  const [primaryColor, setPrimaryColor] = useState<string>("#ff0000");
  const [csvData, setCsvData] = useState<string>("");
  const [csvError, setCsvError] = useState<string | null>(null);
  const [lineSmoothing, setLineSmoothing] = useState<boolean>(false);
  const [cornerRadius, setCornerRadius] = useState<number>(0);
  const [innerRadius, setInnerRadius] = useState<number>(0.5);
  const [bottomFill, setBottomFill] = useState<boolean>(false);

  return (
    <main className="c-app">
      <div className="c-app__body">
        <Logo />
        <ChartSelector 
          inputRef={chartTypeRef}
          chartType={chartType}
          setChartType={setChartType} />
        {
          chartType === "line"
          ? <>
              <LineSmoothingInput
                inputRef={lineSmoothingRef}
                lineSmoothing={lineSmoothing}
                setLineSmoothing={setLineSmoothing} />
              <BottomFillInput
                inputRef={bottomFillRef}
                bottomFill={bottomFill}
                setBottomFill={setBottomFill} />
            </>
          : null
        }
        {
          chartType === "bar" || chartType === "column" || 
          chartType === "grouped-bar" || chartType === "grouped-column"
            ? <CornerRadiusInput
                inputRef={cornerRadiusRef}
                cornerRadius={cornerRadius}
                setCornerRadius={setCornerRadius} />
            : null
        }
        {
          chartType === "donut"
          ? <InnerRadiusInput
              inputRef={innerRadiusRef}
              innerRadius={innerRadius}
              setInnerRadius={setInnerRadius} />
          : null
        }
        <div className="c-control-group">
          <PrimaryColorInput
            inputRef={primaryColorRef}
            primaryColor={primaryColor}
            setPrimaryColor={setPrimaryColor} />
          <ColorSchemeSelector
            inputRef={colorSchemeRef}
            colorScheme={colorScheme}
            setColorScheme={setColorScheme} />
        </div>
        <CsvInput
          inputRef={csvDataRef}
          csvData={csvData}
          chartType={chartType}
          setCsvData={setCsvData}
          csvError={csvError}
          setCsvError={setCsvError} />
      </div>
      <div className="c-app__footer">
        <GenerateButton
          csvData={csvData}
          primaryColor={primaryColor}
          chartType={chartType}
          colorScheme={colorScheme}
          lineSmoothing={lineSmoothing}
          cornerRadius={cornerRadius}
          innerRadius={innerRadius}
          bottomFill={bottomFill}
          csvError={csvError} />
      </div>
    </main>
  );
}

export default App;