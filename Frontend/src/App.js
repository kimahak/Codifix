import React, { useEffect } from "react";
import { io } from "socket.io-client";

function App() {
  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("connect", () => {
      console.log("Connected to backend:", socket.id);
      socket.emit("helloFromReact", "Hi backend! It's me, React.");
    });

    socket.on("messageFromServer", (msg) => {
      console.log("Backend says:", msg);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div>
      <h1>Codifix</h1>
      <p>Look to fkn console "TESTING"</p>
    </div>
  );
}

export default App;
