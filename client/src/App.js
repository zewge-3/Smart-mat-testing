import './App.css';
import React, { useState } from "react";

function App() {
  const [file, setFile] = useState();
  const [analysis, setAnalysis] = useState();
  const [filename, setFilename] = useState("");

  const handleFile = (e) => setFile(e.target.files[0]);

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("http://localhost:5000/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setFilename(data.filename);
  };

  const analyzeFile = async () => {
    const res = await fetch("http://localhost:5000/api/report/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename, userId: "test" }),
    });
    const data = await res.json();
    setAnalysis(data.analysis);
  };

  return (
    <div>
      <h1>Smart Materials Testing & Reporting</h1>
      <input type="file" onChange={handleFile} />
      <button onClick={uploadFile}>Upload File</button>
      {filename && <button onClick={analyzeFile}>Analyze</button>}
      {analysis && (
        <div>
          <h2>Analysis Result</h2>
          <pre>{JSON.stringify(analysis, null, 2)}</pre>
        </div>
      )}
    </div>
  );

}

export default App;

