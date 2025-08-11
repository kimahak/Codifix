import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

function App() {
  const [code, setCode] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to backend:", newSocket.id);
    });

    // When another user sends code
    newSocket.on("codeUpdate", (updatedCode) => {
      setCode(updatedCode);
    });

    return () => newSocket.disconnect();
  }, []);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setCode(newValue);

    // Send to server so others see it
    if (socket) {
      socket.emit("codeChange", newValue);
    }
  };

  return (
    <div>
      <h1>Codifix</h1>
      <textarea
        value={code}
        onChange={handleChange}
        rows={15}
        cols={60}
        placeholder="Start typing code here..."
      />
    </div>
  );
}

export default App;
