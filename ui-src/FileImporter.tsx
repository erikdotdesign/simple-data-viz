import { RefObject } from "react";
import { DataPresetType } from "../types";

const FileImporter = ({ 
  inputRef, 
  setCsvData,
  setDataPreset
}: {
  inputRef: RefObject<HTMLInputElement>;
  setCsvData: (csvData: string) => void;
  setDataPreset: (dataPreset: DataPresetType) => void;
}) => {
  
  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        setCsvData(e.target?.result as string);
        setDataPreset("");
      } catch {
        alert("Invalid CSV file.");
      } finally {
        if (inputRef.current) inputRef.current.value = "";
      }
    };
    reader.readAsText(file);
  };

  return (
    <input
      type="file"
      accept=".csv"
      style={{ display: "none" }}
      ref={inputRef}
      onChange={handleFileImport}/>
  );
};

export default FileImporter;