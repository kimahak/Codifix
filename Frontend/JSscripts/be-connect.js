// connect to backend
const  socket = io("http://localhost:5000");

socket.on('connection', (stream) => {
   document.getElementById("status").textContent = "Connected! 🎉";
        console.log("Connected to server with ID:", socket.id);
         // Send hello to backend
        socket.emit("helloFromClient", "Hello from browser!");
      });

      socket.on("disconnect", () => {
        document.getElementById("status").textContent = "Disconnected 😢";

});