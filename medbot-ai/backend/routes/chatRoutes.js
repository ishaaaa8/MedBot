const express = require("express");
const router = express.Router();
const { getMedicalResponse } = require("../controllers/ragChatbot"); // Import function

// ✅ Chatbot query route
router.post("/", async (req, res) => {
    try {
        const { userEmail, query } = req.body; // Get user email & query

        if (!userEmail || !query) {
            return res.status(400).json({ error: "User email and query are required." });
        }

        console.log(`📩 New Chat Query from ${userEmail}: ${query}`);

        const response = await getMedicalResponse(userEmail, query); // Get AI response

        console.log(`✅ AI Response for ${userEmail}:`, response);
        res.json({ answer: response });

    } catch (error) {
        console.error("🔥 ERROR: Chatbot processing failed!", error);
        res.status(500).json({ error: "Internal Server Error. Please try again later." });
    }
});

module.exports = router;
