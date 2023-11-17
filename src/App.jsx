import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [jsonText, setJsonText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const jsonTextRef = useRef();

  useEffect(() => {
    if (jsonText === "") {
      setJsonText(jsonTextRef.current?.value);
    }
  }, [jsonText]);

  const handleJsonFormat = () => {
    try {
      const formattedJsonText = JSON.stringify(JSON.parse(jsonText), null, 2);
      jsonTextRef.current.value = formattedJsonText;
      setJsonText("");
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <>
      <div className="menu">
        <button className="btn-format" onClick={handleJsonFormat}>
          Format
        </button>
        <div className="error-msg">{errorMsg}</div>
      </div>
      <textarea
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
