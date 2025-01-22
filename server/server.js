const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv"); // Add dotenv to load environment variables
const cors = require("cors");
const path = require("path");

// Import routes
const authRoutes = require("./routes/auth");
const materialRoutes = require("./routes/materials");

// Load environment variables from .env file
dotenv.config(); // This loads the .env file

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000; // Use PORT from .env or default to 5000

// Middleware
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/materials", materialRoutes);

// MongoDB connection using MONGO_URI from .env
const MONGO_URI = process.env.MONGO_URI; // Get the MongoDB URI from .env

if (!MONGO_URI) {
    console.error("❌ Missing MongoDB connection URI in .env file");
    process.exit(1); // Exit the app if MONGO_URI is not found
}

mongoose
    .connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

// Serve React frontend
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build", "index.html"));
});

// Start the server
app.listen(PORT, () => {
    console.log(
        `🚀 Server running on http://${process.env.HOST || "localhost"}:${PORT}`
    );
});
