import Editor from "@monaco-editor/react";
import { useState, useRef, useEffect } from "react";

import { FORMAT_TYPES, LOCAL_STORAGE_KEY } from "./utils/consants";
import { decodeEntities } from "./utils/htmlDecode";

import "./App.css";

export default function App() {
  const [codeText, setCodeText] = useState("");
  const [formatType, setFormatType] = useState("json");
  const [darkMode, setDarkMode] = useState(false);
  const editorRef = useRef(null);

  //load previous data
  useEffect(() => {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    const jsonObj = JSON.parse(data);
    console.log(jsonObj, "json obj");
    if (jsonObj) {
      setFormatType(jsonObj["formatType"] ?? "json");
      setCodeText(jsonObj["codeText"] ?? "");
      setDarkMode(jsonObj["darkMode"] ?? false);
    }
  }, []);

  useEffect(() => {
    if (codeText && editorRef) {
      editorRef.current.getAction("editor.action.formatDocument").run();
    }
  }, [formatType, codeText]);

  //update local storage
  useEffect(() => {
    updateLocalStorage();
  }, [formatType, codeText, darkMode]);

  const handleEditorDidMount = (editor) => {
    // "monacoRef" was instantiated using React.useRef()
    editorRef.current = editor;
    // this varies from my answer in StackOverflow for some reason...
    setTimeout(() => {
      formatCode();
    }, 1000);
  };

  const handleFormatTypeChange = (type) => {
    setFormatType(type);
  };

  const handleFormatClick = () => {
    formatCode();
  };

  const handleInputChange = (newValue) => {
    const deCodedValue = decodeEntities(newValue);
    setCodeText(deCodedValue);
  };

  const handleToggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const updateLocalStorage = () => {
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({ formatType, codeText, darkMode })
    );
  };

  const formatCode = () => {
    editorRef.current.getAction("editor.action.formatDocument").run();
  };

  return (
    <>
      <div
        className={`menu ${darkMode ? "menu-dark-mode" : "menu-light-mode"}`}
      >
        <div>
          <select
            onChange={(e) => handleFormatTypeChange(e.target.value)}
            className={`format-type ${darkMode ? "general-dark-mode" : ""}`}
          >
            {FORMAT_TYPES.map((ele, index) => (
              <option key={index} value={ele.type}>
                {ele.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button
            className={`btn btn-clear ${darkMode ? "general-dark-mode" : ""}`}
            onClick={() => setCodeText("")}
          >
            Clear
          </button>
          <button
            className={`btn btn-format ${darkMode ? "general-dark-mode" : ""}`}
            onClick={() => handleFormatClick()}
          >
            Format
          </button>
        </div>

        <div
          className={`toggle ${
            darkMode ? "toggle-dark-mode" : "toggle-light-mode"
          }`}
          onClick={handleToggleDarkMode}
        >
          <div
            className={`toggle-inner ${
              darkMode ? "toggle-inner-dark-mode" : "toggle-inner-light-mode"
            }`}
          />
        </div>
      </div>
      <Editor
        className="json-text"
        value={codeText}
        theme={darkMode ? "vs-dark" : "light"}
        options={{
          formatOnPaste: true,
        }}
        language={formatType}
        onChange={(value) => handleInputChange(value)}
        onMount={handleEditorDidMount}
      />
    </>
  );
}
