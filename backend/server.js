const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const medicalRoutes = require("./routes/medicalRoutes");
const chatRoutes = require("./routes/chatRoutes");

dotenv.config();
const app = express();

// Connect to MongoDB
connectDB();

// Configure CORS to accept only from your frontend domain
const corsOptions = {
  origin: "https://medbot-frontend.onrender.com",
  credentials: true, // if you're sending cookies or auth headers
};
app.use(cors(corsOptions));

// Parse incoming JSON requests
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/medical", medicalRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/admin", require("./routes/adminRoutes"));

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
