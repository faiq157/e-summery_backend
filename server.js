// server.js
const express = require("express");
const http = require("http"); // To create a server with both Express and Socket.IO
const socketIo = require("socket.io"); // Import Socket.IO
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const messageSocketHandler = require("./socket/messageSocketHandler");

dotenv.config();
connectDB();

// Initialize Express app
const app = express();

// Middleware for parsing JSON
app.use(express.json());

// Set up CORS for REST API
app.use(
  cors({
    origin: ["http://localhost:5173", "https://e-summery.netlify.app"], // List origins in an array
    methods: ["GET", "POST"], // Allow HTTP methods
    credentials: true,        // Allow credentials (e.g., cookies, Authorization headers)
  })
);


// Use your existing routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/messages", require("./routes/messages"));

// Create HTTP server and bind it to the Express app
const server = http.createServer(app);

// Initialize Socket.IO on top of the server
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",  // Allow Socket.IO connections from your frontend
    methods: ["GET", "POST"],         // Allow methods for Socket.IO
    credentials: true,                // Allow credentials for WebSockets
  },
});

// Use the socket handler for messaging
messageSocketHandler(io);

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
