import { useState } from "react";
import "./App.css";

function App() {
  const [jsonText, setJsonText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleJsonClear = () => {
    setJsonText("");
  };

  const handleJsonFormat = () => {
    if (!jsonText) return;
    try {
      const formattedJsonText = JSON.stringify(JSON.parse(jsonText), null, 2);
      setJsonText(formattedJsonText);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <>
      <div className="menu">
        <div className="title">JSON Viewer</div>
        <button className="btn btn-clear" onClick={handleJsonClear}>
          Clear
        </button>
        <button className="btn btn-format" onClick={handleJsonFormat}>
          Format
        </button>
        <div className="error-msg">{errorMsg}</div>
      </div>
      <textarea
        value={jsonText}
        className="json-text"
        onChange={(e) => {
          setJsonText(e.target.value);
          setErrorMsg("");
        }}
      ></textarea>
    </>
  );
}

export default App;
