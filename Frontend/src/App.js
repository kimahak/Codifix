import React, { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import io from "socket.io-client";

// Connect to backend
const socket = io("http://localhost:3001"); // Change to your server URL if deployed

export default function App() {
  const [code, setCode] = useState("// Start coding here...");

  useEffect(() => {
    // Listen for code updates from other users
    socket.on("code-update", (newCode) => {
      setCode(newCode);
    });

    return () => {
      socket.off("code-update");
    };
  }, []);

  const handleChange = (value) => {
    setCode(value);
    socket.emit("code-change", value); // Send changes to server
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Codifix Editor</h1>
      <CodeMirror
        value={code}
        height="400px"
        extensions={[javascript({ jsx: true })]}
        onChange={handleChange}
      />
    </div>
  );
}
