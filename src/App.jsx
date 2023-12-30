import Editor from "@monaco-editor/react";
import { useState, useRef, useEffect } from "react";

const formatTypes = [
  { type: "json", name: "JSON" },
  { type: "html", name: "HTML" },
  { type: "javascript", name: "JAVASCRIPT" },
];

export default function App() {
  const [code, setCode] = useState("");
  const [curType, setCurType] = useState("json");
  const editorRef = useRef(null);

  useEffect(() => {
    if (code && editorRef) {
      editorRef.current.getAction("editor.action.formatDocument").run();
    }
  }, [curType]);

  const handleEditorDidMount = (editor) => {
    // "monacoRef" was instantiated using React.useRef()
    editorRef.current = editor;
    // this varies from my answer in StackOverflow for some reason...
    setTimeout(() => {
      editorRef.current.getAction("editor.action.formatDocument").run();
    }, 1000);
  };

  const handleTypeChangeClick = (type) => {
    console.log(type, "new type -----");
    setCurType(type);
  };

  const handleFormatClick = () => {
    editorRef.current.getAction("editor.action.formatDocument").run();
  };

  return (
    <div>
      <div>
        <select
          onChange={(e) => handleTypeChangeClick(e.target.value)}
          style={{ height: "2rem", width: "12rem" }}
        >
          {formatTypes.map((ele, index) => (
            <option key={index} value={ele.type}>
              {ele.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <button onClick={() => setCode("")}>Clear</button>
        <button onClick={() => handleFormatClick()}>Format</button>
      </div>
      <Editor
        value={code}
        height="700px"
        theme="vs-dark"
        options={{
          formatOnPaste: true,
        }}
        language={curType}
        onChange={(value) => setCode(value)}
        onMount={handleEditorDidMount}
      />
    </div>
  );
}
