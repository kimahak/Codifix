import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { basicSetup } from "@codemirror/basic-setup";
import { javascript } from "@codemirror/lang-javascript";

function App() {
  const editorRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [view, setView] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    newSocket.on("codeUpdate", (updatedCode) => {
      if (view) {
        view.dispatch({
          changes: { from: 0, to: view.state.doc.length, insert: updatedCode }
        });
      }
    });

    return () => newSocket.disconnect();
  }, [view]);

  useEffect(() => {
    if (editorRef.current && !view) {
      const startState = EditorState.create({
        doc: "",
        extensions: [
          basicSetup,
          javascript(),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              const code = update.state.doc.toString();
              if (socket) socket.emit("codeChange", code);
            }
          })
        ]
      });

      const newView = new EditorView({
        state: startState,
        parent: editorRef.current
      });

      setView(newView);
    }
  }, [editorRef, view, socket]);

  return (
    <div>
      <h1>Codifix</h1>
      <div ref={editorRef} style={{ border: "1px solid #ccc", height: "500px" }}></div>
    </div>
  );
}

export default App;
