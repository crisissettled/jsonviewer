import Editor from "@monaco-editor/react";
import { useRef, useEffect } from "react";

import {
  CODE_FORMAT_CODE_TEXT,
  CODE_FORMAT_DARK_MODE,
  CODE_FORMAT_TYPE,
  FORMAT_TYPES,
} from "./utils/consants";
import { decodeEntities } from "./utils/htmlDecode";

import "./App.css";
import { useLocalStorage } from "./hooks/useLocalStorage";

export default function App() {
  const [codeText, setCodeText] = useLocalStorage(CODE_FORMAT_CODE_TEXT, "");
  const [formatType, setFormatType] = useLocalStorage(CODE_FORMAT_TYPE, "json");
  const [darkMode, setDarkMode] = useLocalStorage(CODE_FORMAT_DARK_MODE, false);
  const editorRef = useRef(null);

  useEffect(() => {
    if (codeText && editorRef.current) {
      editorRef.current?.getAction("editor.action.formatDocument").run();
    }
  }, [formatType, codeText]);

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
            value={formatType}
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
