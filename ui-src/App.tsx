import { useRef, useState, useEffect } from "react";
import "./App.css";
import { ChartType, ColorSchemeType } from "../types";
import ChartSelector from "./ChartSelector";
import PrimaryColorInput from "./PrimaryColorInput";
import CsvInput from "./CsvInput";
import GenerateButton from "./GenerateButton";
import ColorSchemeSelector from "./ColorSchemeSelector";
import LineSmoothingInput from "./LineSmoothingInput";
import CornerRadiusRatioInput from "./CornerRadiusRatioInput";
import InnerRadiusInput from "./InnerRadiusInput";
import BottomFillInput from "./BottomFillInput";
import BarSizeRatioInput from "./BarSizeRatioInput";
import BarSpaceRatioInput from "./BarSpaceRatioInput";
import PointRadiusRatioInput from "./PointRadiusRatioInput";
import StrokeWeightRatioInput from "./StrokeWeightRatioInput";
import Logo from "./Logo";

const App = () => {
  const chartTypeRef = useRef<HTMLSelectElement>(null);
  const colorSchemeRef = useRef<HTMLSelectElement>(null);
  const primaryColorRef = useRef<HTMLInputElement>(null);
  const csvDataRef = useRef<HTMLTextAreaElement>(null);
  const lineSmoothingRef = useRef<HTMLInputElement>(null);
  const cornerRadiusRatioRef = useRef<HTMLInputElement>(null);
  const innerRadiusRef = useRef<HTMLInputElement>(null);
  const bottomFillRef = useRef<HTMLInputElement>(null);
  const barSpaceRatioRef = useRef<HTMLInputElement>(null);
  const barSizeRatioRef = useRef<HTMLInputElement>(null);
  const pointRadiusRatioRef = useRef<HTMLInputElement>(null);
  const strokeWeightRatioRef = useRef<HTMLInputElement>(null);
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [colorScheme, setColorScheme] = useState<ColorSchemeType>("monochrome");
  const [primaryColor, setPrimaryColor] = useState<string>("#ff0000");
  const [csvData, setCsvData] = useState<string>("");
  const [csvError, setCsvError] = useState<string | null>(null);
  const [lineSmoothing, setLineSmoothing] = useState<boolean>(false);
  const [cornerRadiusRatio, setCornerRadiusRatio] = useState<number>(0);
  const [innerRadius, setInnerRadius] = useState<number>(0.5);
  const [bottomFill, setBottomFill] = useState<boolean>(false);
  const [barSpaceRatio, setBarSpaceRatio] = useState<number>(0.2);
  const [barSizeRatio, setBarSizeRatio] = useState<number>(0.5);
  const [pointRadiusRatio, setPointRadiusRatio] = useState<number>(0.01);
  const [strokeWeightRatio, setStrokeWeightRatio] = useState<number>(0.005);

  // load cached values
  useEffect(() => {
    parent.postMessage({ pluginMessage: { type: "load-storage", key: "cache" } }, "*");

    window.onmessage = (event) => {
      const msg = event.data.pluginMessage;
      if (msg.type === "storage-loaded") {
        if (msg.key === "cache" && msg.value) {
          setChartType(msg.value.chartType);
          setColorScheme(msg.value.colorScheme);
          setPrimaryColor(msg.value.primaryColor);
          setCornerRadiusRatio(msg.value.cornerRadiusRatio);
          setLineSmoothing(msg.value.lineSmoothing);
          setInnerRadius(msg.value.innerRadius);
          setBottomFill(msg.value.bottomFill);
          setBarSpaceRatio(msg.value.barSpaceRatio);
          setBarSizeRatio(msg.value.barSizeRatio);
          setCsvData(msg.value.csvData);
          setPointRadiusRatio(msg.value.pointRadiusRatio);
          setStrokeWeightRatio(msg.value.strokeWeightRatio);
        };
      }
    };
  }, []);

  useEffect(() => {
    parent.postMessage({
      pluginMessage: { type: "save-storage", key: "cache", value: {
        chartType, 
        colorScheme, 
        primaryColor, 
        cornerRadiusRatio,
        lineSmoothing, 
        innerRadius, 
        bottomFill, 
        barSpaceRatio, 
        barSizeRatio, 
        csvData,
        pointRadiusRatio,
        strokeWeightRatio
      }},
    }, "*");
  }, [chartType, colorScheme, primaryColor, cornerRadiusRatio, lineSmoothing, innerRadius, bottomFill, barSpaceRatio, barSizeRatio, csvData, pointRadiusRatio, strokeWeightRatio]);

  return (
    <main className="c-app">
      <div className="c-app__body">
        <Logo />
        <ChartSelector 
          inputRef={chartTypeRef}
          chartType={chartType}
          csvError={csvError}
          setCsvError={setCsvError}
          setCsvData={setCsvData}
          setChartType={setChartType} />
        <div className="c-control-group">
          <div className="c-control-group__item">
            <PrimaryColorInput
              inputRef={primaryColorRef}
              primaryColor={primaryColor}
              setPrimaryColor={setPrimaryColor} />
          </div>
          <div className="c-control-group__item">
            <ColorSchemeSelector
              inputRef={colorSchemeRef}
              colorScheme={colorScheme}
              setColorScheme={setColorScheme} />
          </div>
        </div>
        {
          chartType === "line" || chartType === "area"
          ? <>
              <StrokeWeightRatioInput
                inputRef={strokeWeightRatioRef}
                strokeWeightRatio={strokeWeightRatio}
                setStrokeWeightRatio={setStrokeWeightRatio} />
              <div className="c-control-group">
                <div className="c-control-group__item">
                  <LineSmoothingInput
                    inputRef={lineSmoothingRef}
                    lineSmoothing={lineSmoothing}
                    setLineSmoothing={setLineSmoothing} />
                </div>
                {
                  chartType === "line"
                  ? <div className="c-control-group__item">
                      <BottomFillInput
                        inputRef={bottomFillRef}
                        bottomFill={bottomFill}
                        setBottomFill={setBottomFill} />
                    </div>
                  : null
                }
              </div>
            </>
          : null
        }
        {
          chartType === "bar" || chartType === "column" || 
          chartType === "grouped-bar" || chartType === "grouped-column"
            ? <div className="c-control-group">
                <div className="c-control-group__item">
                  <BarSizeRatioInput
                    inputRef={barSizeRatioRef}
                    barSizeRatio={barSizeRatio}
                    setBarSizeRatio={setBarSizeRatio} />
                </div>
                {
                  chartType === "grouped-bar" || chartType === "grouped-column"
                  ? <div className="c-control-group__item">
                      <BarSpaceRatioInput
                        inputRef={barSpaceRatioRef}
                        barSpaceRatio={barSpaceRatio}
                        setBarSpaceRatio={setBarSpaceRatio} />
                    </div>
                  : null
                }
                <div className="c-control-group__item">
                  <CornerRadiusRatioInput
                    inputRef={cornerRadiusRatioRef}
                    cornerRadiusRatio={cornerRadiusRatio}
                    setCornerRadiusRatio={setCornerRadiusRatio} />
                </div>
              </div>
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
        {
          chartType === "scatter"
            ? <PointRadiusRatioInput
                inputRef={pointRadiusRatioRef}
                pointRadiusRatio={pointRadiusRatio}
                setPointRadiusRatio={setPointRadiusRatio} />
            : null
        }
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
          cornerRadiusRatio={cornerRadiusRatio}
          innerRadius={innerRadius}
          bottomFill={bottomFill}
          barSpaceRatio={barSpaceRatio}
          barSizeRatio={barSizeRatio}
          pointRadiusRatio={pointRadiusRatio}
          strokeWeightRatio={strokeWeightRatio}
          csvError={csvError} />
      </div>
    </main>
  );
}

export default App;