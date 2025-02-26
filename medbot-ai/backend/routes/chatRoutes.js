const express = require("express");
const router = express.Router();
const { getMedicalResponse } = require("../controllers/ragChatbot"); // Import function

router.post("/chat", async (req, res) => {
    try {
        const { user_info, input } = req.body; // Get user info & query

        if (!user_info || !input) {
            return res.status(400).json({ error: "User info and input query are required." });
        }

        const response = await getMedicalResponse(user_info, input); // Pass both user info & input

        res.json({ answer: response }); // Send chatbot response
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
