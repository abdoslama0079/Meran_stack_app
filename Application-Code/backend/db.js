const mongoose = require("mongoose");

/**
 * 🔹 MONGODB CONNECTION ENGINE
 * Optimized for Docker & Azure Environment Variables
 */
module.exports = async () => {
    try {
        const connectionParams = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // 🔹 Best Practice: Prevent long hangs if the DB is down
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };

        // 🔹 Check if we need authentication (Standard for Cloud/VM)
        const useDBAuth = process.env.USE_DB_AUTH === "true" || !!process.env.MONGO_USERNAME;

        if (useDBAuth) {
            connectionParams.user = process.env.MONGO_USERNAME;
            connectionParams.pass = process.env.MONGO_PASSWORD;
            // 🔹 Required for Mongo root users in most Docker setups
            connectionParams.authSource = "admin";
        }

        // 🔹 Perform the Connection
        await mongoose.connect(
           process.env.MONGO_CONN_STR,
           connectionParams
        );

        console.log("✅ Successfully connected to MongoDB.");
    } catch (error) {
        console.error("❌ DATABASE CONNECTION ERROR:", error.message);
        process.exit(1);
    }
};