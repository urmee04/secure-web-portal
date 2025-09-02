//load environment variables from .env file
require("dotenv").config();

const mongoose = require("mongoose");

//establish MongoDB connection using connection string from environment variables
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    //connection successful, log database name
    console.log(`Connected to MongoDB database: ${mongoose.connection.name}`);
  })
  .catch((error) => {
    //connection failed, log error and exit process
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1); //exit with error code for container restart scenarios
  });

//listen for connection errors after initial connection
//handles cases where connection drops after successful initial connect
mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error:", error.message);
});
