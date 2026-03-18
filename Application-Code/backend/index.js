require("dotenv").config(); // load environment variables
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan"); // logging middleware
const helmet = require("helmet"); // security headers
const tasks = require("./routes/tasks");
const connection = require("./db");

const app = express();

// 🔹 Connect to DB
connection();

// 🔹 Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev")); // logs requests
app.use(helmet()); // adds security headers

// 🔹 Health check endpoints
app.get("/healthz", (req, res) => {
  res.status(200).send("Healthy");
});

let lastReadyState = null;
app.get("/ready", (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  if (isDbConnected !== lastReadyState) {
    console.log(`Database readyState: ${mongoose.connection.readyState}`);
    lastReadyState = isDbConnected;
  }

  if (isDbConnected) {
    res.status(200).send("Ready");
  } else {
    res.status(503).send("Not Ready");
  }
});

app.get("/started", (req, res) => {
  res.status(200).send("Started");
});

// 🔹 Routes
app.use("/api/tasks", tasks);

// 🔹 Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// 🔹 Graceful shutdown
const port = process.env.PORT || 3500;
const server = app.listen(port, () =>
  console.log(`🚀 Server running on port ${port}...`)
);

process.on("SIGINT", async () => {
  console.log("🛑 Shutting down gracefully...");
  await mongoose.connection.close();
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});
