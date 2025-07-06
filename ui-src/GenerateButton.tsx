import papaParse from "papaparse";
import { ChartType } from "./types";
import "./GenerateButton.css";

const GenerateButton = ({
  csvData,
  primaryColor,
  chartType,
  csvError
}: {
  csvData: string;
  primaryColor: string;
  chartType: ChartType;
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
                color: primaryColor
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
      Generate Chart
    </button>
  );
}

export default GenerateButton;