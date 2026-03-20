const mongoose = require("mongoose");

module.exports = async () => {
    try {
        // 1. Build the Connection String
        // If your MONGO_CONN_STR is just the host (like mongodb://mongo-srv:27017/mern)
        // we add the authSource to ensure the 'admin' user is recognized.
        let connectionString = process.env.MONGO_CONN_STR;
        
        if (!connectionString.includes('authSource')) {
            // Append authSource=admin if it's missing
            connectionString += (connectionString.includes('?') ? '&' : '?') + 'authSource=admin';
        }

        const connectionParams = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // 2. Pass user/pass directly if they exist in Env Vars
            user: process.env.MONGO_USERNAME,
            pass: process.env.MONGO_PASSWORD,
        };

        console.log("Attempting to connect to MongoDB...");
        
        await mongoose.connect(connectionString, connectionParams);
        
        console.log("✅ Connected to database successfully.");
    } catch (error) {
        console.log("❌ Could not connect to database.", error);
        // Important: In a real app, you might want to exit if DB fails
        // process.exit(1); 
    }
};
