const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const medicalRoutes = require("./routes/medicalRoutes");
const chatRoutes = require("./routes/chatRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Load environment variables from .env
dotenv.config();

// Create Express app
const app = express();

// Connect to MongoDB
connectDB();

// Allowed frontend origins
const allowedOrigins = [
  "https://medbot-frontend.onrender.com",
  "https://medbot-ai-5wnt.onrender.com"
];

// Configure CORS
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

// Middleware to parse incoming JSON requests
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/medical", medicalRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/admin", adminRoutes);

// Start the server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const connectDB = require("./config/db");  // Import MongoDB connection function
// const authRoutes = require("./routes/authRoutes");
// const medicalRoutes = require("./routes/medicalRoutes");

// const chatRoutes = require("./routes/chatRoutes");


// dotenv.config();
// const app = express();

// // Connect to MongoDB
// connectDB();

// app.use(cors());
// app.use(express.json());

// app.use("/auth", authRoutes);
// app.use("/medical", medicalRoutes); 
// app.use("/api/chat", chatRoutes); 
// app.use("/api/admin", require("./routes/adminRoutes")); // Admin routes

// const PORT = process.env.PORT || 5050;

// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
