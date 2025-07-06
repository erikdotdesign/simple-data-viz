import papaParse from "papaparse";
import { ChartType, ColorSchemeType } from "./types";
import "./GenerateButton.css";

const GenerateButton = ({
  csvData,
  primaryColor,
  chartType,
  colorScheme,
  lineSmoothing,
  cornerRadius,
  innerRadius,
  bottomFill,
  csvError
}: {
  csvData: string;
  primaryColor: string;
  chartType: ChartType;
  colorScheme: ColorSchemeType;
  lineSmoothing: boolean;
  cornerRadius: number;
  innerRadius: number;
  bottomFill: boolean;
  csvError: string | null;
}) => {

  const handleGenerate = () => {
    if (csvData) {
      const parsedData = papaParse.parse(csvData, {
        dynamicTyping: true,
        skipEmptyLines: true
      });
      if (!parsedData.errors.length) {
        const dataWithoutHeader = parsedData.data.length > 1 && typeof (parsedData.data as any)[0][1] === "string"
          ? parsedData.data.slice(1)
          : parsedData.data;
        parent.postMessage(
          { 
            pluginMessage: { 
              type: "generate-chart", 
              chart: { 
                type: chartType, 
                data: dataWithoutHeader,
                colorOpts: {
                  primaryColor,
                  colorScheme
                },
                chartOpts: {
                  cornerRadius,
                  lineSmoothing,
                  innerRadius,
                  bottomFill
                }
              } 
            } 
          },
          "*"
        );
      }
    }
  };

  return (
    <button 
      id="generate"
      className="c-generate-button"
      onClick={handleGenerate}
      disabled={!!csvError}>
      Generate chart
    </button>
  );
}

export default GenerateButton;