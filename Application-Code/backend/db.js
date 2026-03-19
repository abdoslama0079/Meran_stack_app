const mongoose = require("mongoose");

module.exports = async () => {
    try {
        const connectionParams = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };

        // If credentials exist (from Key Vault), use them
        if (process.env.MONGO_USERNAME && process.env.MONGO_PASSWORD) {
            connectionParams.user = process.env.MONGO_USERNAME;
            connectionParams.pass = process.env.MONGO_PASSWORD;
            // Best Practice: Authenticate against the admin database in Mongo
            connectionParams.authSource = "admin";
        }

        await mongoose.connect(
           process.env.MONGO_CONN_STR,
           connectionParams
        );
        console.log("✅ Connected to MongoDB.");
    } catch (error) {
        console.error("❌ Could not connect to database:", error.message);
        // Force exit so Kubernetes Pod restarts and tries again
        process.exit(1);
    }
};