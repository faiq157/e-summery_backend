const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

// Initialize Express app
const app = express();

// Middleware for parsing JSON
app.use(express.json());

// Set up CORS for REST API
app.use(
  cors({
    origin: ["http://localhost:5173", "https://e-summery.netlify.app"],
     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);

app.use("/api/auth", require("./routes/auth"));
app.use("/api/notesheet", require("./routes/notesheet"));
app.use("/api",require("./routes/saveToken"));
app.use("/api",require("./routes/sendNotifications"))
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));