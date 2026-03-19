const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');

// 🔹 Import Local Modules
const connection = require("./db");
const tasks = require("./routes/tasks");

// 🔹 Initialize App
const app = express();
const port = process.env.PORT || 3500;

// 🔹 Connect to MongoDB
connection();

/* -------------------------------------------------------------------------- */
/* 🛠️ MIDDLEWARE                                                              */
/* -------------------------------------------------------------------------- */
app.use(express.json()); // Allows the API to read JSON data
app.use(cors());         // Allows your Frontend to talk to the Backend

/* -------------------------------------------------------------------------- */
/* 🏥 KUBERNETES & AZURE HEALTH CHECKS                                        */
/* -------------------------------------------------------------------------- */

// 1. Health: Is the server alive?
app.get('/healthz', (req, res) => res.status(200).send('✅ Server is Alive'));

// 2. Ready: Is the Database connected and ready for traffic?
app.get('/ready', (req, res) => {
    const isDbConnected = mongoose.connection.readyState === 1;
    if (isDbConnected) {
        res.status(200).send('✅ Database Ready');
    } else {
        res.status(503).send('❌ Database Not Connected');
    }
});

// 3. Started: Has the app finished booting up?
app.get('/started', (req, res) => res.status(200).send('✅ App Started'));

/* -------------------------------------------------------------------------- */
/* 📝 ROUTES                                                                  */
/* -------------------------------------------------------------------------- */
app.use("/api/tasks", tasks);

// Welcome Route (Great for testing your VM IP in the browser)
app.get("/", (req, res) => {
    res.send("<h1>🚀 Welcome to the To-Do API</h1><p>Running on Port " + port + "</p>");
});

/* -------------------------------------------------------------------------- */
/* 🛡️ GLOBAL ERROR HANDLER                                                    */
/* -------------------------------------------------------------------------- */
app.use((err, req, res, next) => {
    console.error("❌ Unexpected Error:", err.stack);
    res.status(500).json({
        success: false,
        message: "Something went wrong on our end! 😢",
        error: process.env.NODE_ENV === 'production' ? null : err.message
    });
});

/* -------------------------------------------------------------------------- */
/* 🚀 SERVER STARTUP                                                          */
/* -------------------------------------------------------------------------- */
app.listen(port, () => {
    console.log(`
    🚀 Backend is "Pretty" and Ready!
    📡 Listening on Port: ${port}
    🔗 Local Health: http://localhost:${port}/healthz
    `);
});