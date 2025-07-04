import { useRef, useState } from "react";
import Papa from "papaparse";
import "./App.css";

function App() {
  const selectInputRef = useRef<HTMLSelectElement>(null);
  const textareaInputRef = useRef<HTMLTextAreaElement>(null);
  const checkBoxRef = useRef<HTMLInputElement>(null);
  const [primaryColor, setPrimaryColor] = useState("#ff0000"); // default red

  const onCreate = () => {
    const chartType = selectInputRef.current?.value;
    const chartData = textareaInputRef.current?.value;
    const chartHeaders = checkBoxRef.current?.checked;
    if (chartData) {
      const parsedData = Papa.parse(chartData, {
        dynamicTyping: true,
        skipEmptyLines: true
      });
      if (!parsedData.errors.length) {
        const headers = chartHeaders ? parsedData.data[0] : null;
        const data = chartHeaders ? parsedData.data.slice(1) : parsedData.data;
        parent.postMessage(
          { 
            pluginMessage: { 
              type: "generate-chart", 
              chart: { 
                type: chartType, 
                data,
                headers,
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
    <main>
      <header>
        <h2>Data viz</h2>
      </header>
      <section>
        <label>Chart Type:</label>
        <select 
          id="chart-type"
          ref={selectInputRef}>
          <option value="bar">Bar</option>
          <option value="column">Column</option>
          <option value="line">Line</option>
          <option value="pie">Pie</option>
          <option value="scatter">Scatter</option>
        </select>
        <br />
        <input ref={checkBoxRef} type="checkbox" id="chart-headers" name="chart-headers" defaultChecked />
        <label htmlFor="chart-headers">Has headers</label>
        <br />
        <label htmlFor="primary-color">Primary color:</label><br />
        <input
          type="color"
          id="primary-color"
          value={primaryColor}
          onChange={(e) => setPrimaryColor(e.target.value)}
        />
        <br />
        <label>Paste CSV data (label,value):</label><br />
        <textarea 
          id="data-input"
          style={{
            width: '100%',
            height: "200px"
          }}
          ref={textareaInputRef}
          defaultValue={`Category	Value\nCategory 1	15\nCategory 2	91\nCategory 3	95\nCategory 4	20\nCategory 5	61`} />
        <br />
        <button 
          id="generate"
          onClick={onCreate}>
          Generate Chart
        </button>
      </section>
    </main>
  );
}

export default App;