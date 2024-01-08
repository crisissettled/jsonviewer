import Editor from "@monaco-editor/react";
import { useRef, useEffect, useState } from "react";

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
  const [wordCount, setWordCount] = useState({
    wordCount: null,
    charCount: null,
  });
  const editorRef = useRef(null);

  useEffect(() => {
    if (codeText && editorRef.current) {
      editorRef.current?.getAction("editor.action.formatDocument").run();
      countWordAndChar(codeText);
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
    countWordAndChar(codeText);
  };

  const countWordAndChar = (txt) => {
    const newLineChar = "\n";
    if (txt) {
      const trimmedText = txt.trim(newLineChar);
      const words = trimmedText.split(" ").filter((x) => x !== "");
      let wordCountAdjust = 0;
      for (let w of words) {
        const newLineIndex = w.indexOf(newLineChar);
        if (newLineIndex > -1) {
          wordCountAdjust += 1;
        }
      }

      const wordCount = words.length + wordCountAdjust;

      const regx = /\n/g;
      const charCount = txt.replace(regx, "").length;

      setWordCount({ wordCount, charCount });
    }
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
          {wordCount.wordCount && wordCount.wordCount && (
            <span
              className={`word-count ${darkMode ? "general-dark-mode" : ""}`}
            >
              {wordCount.wordCount} words, {wordCount.charCount} characters
            </span>
          )}
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
          title="Switch between dark and light mode (currently light mode)"
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
