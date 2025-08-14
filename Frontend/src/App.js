import React, { useEffect, useRef, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:3001";
const DOC_ID = "main"; // can make dynamic later

export default function App() {
  const [code, setCode] = useState("");
  const [loaded, setLoaded] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ["websocket"] });
    socketRef.current = socket;

    socket.emit("get-document", DOC_ID);

    socket.on("load-document", (document) => {
      setCode(document);
      setLoaded(true);
    });

    socket.on("code-update", (newCode) => {
      setCode(newCode);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleChange = (value) => {
    setCode(value);
    if (loaded) {
      socketRef.current.emit("code-change", value);
    }
  };

  return (
    <div style={{ padding: "16px" }}>
      <h1>Codifix</h1>
      <CodeMirror
        value={code}
        height="500px"
        extensions={[javascript({ jsx: true })]}
        onChange={handleChange}
      />
    </div>
  );
}