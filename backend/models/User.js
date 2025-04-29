
const mongoose = require("mongoose");

// Create a schema for conversation summaries
const ConversationSummarySchema = new mongoose.Schema({
  summary: { type: String, required: true },
  sentiment: { 
    label: { type: String },
    confidence: { type: Number }
  },
  createdAt: { type: Date, default: Date.now }
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  conversationHistory: [ConversationSummarySchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);