

const { ChatGroq } = require("@langchain/groq");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { StringOutputParser } = require("@langchain/core/output_parsers");
const axios = require("axios");
const User = require("../models/User"); 
const Admin = require("../models/Admin"); 



/**
 * Summarize a medical chatbot conversation, analyze its sentiment, and store in database.
 *
 * @param {string} conversationHistory - The conversation text
 * @param {string} userEmail - User's email for tracking
 * @returns {Promise<string>} The summary
 */
async function createSummarizeChain(conversationHistory, userEmail) {
    try {
        const groq = new ChatGroq({
            apiKey: process.env.GROQ_API_KEY || "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",
            model: "deepseek-r1-distill-llama-70b",
            temperature: 0.3,
        });

        const summaryPrompt = ChatPromptTemplate.fromTemplate(`
            You are an expert medical conversation analyst. Your task is to create a comprehensive yet concise 
            summary of a medical chatbot conversation between a user and MedBot (an AI medical assistant).

            The summary should:
            1. Highlight the main medical topics discussed
            2. Note any symptoms or conditions mentioned
            3. Summarize advice or explanations provided by the bot
            4. Identify any follow-up actions recommended to the user
            5. Maintain medical accuracy while being concise

            Conversation History:
            ==================
            ${conversationHistory}
            ==================

            Please provide a professional medical conversation summary in 3-5 key points.
        `);

        const chain = summaryPrompt.pipe(groq).pipe(new StringOutputParser());

        console.log(` Executing summary chain for ${userEmail}...`);
        let summary = await chain.invoke({});

        if (typeof summary === "object") {
            summary = JSON.stringify(summary, null, 2);
        }

        console.log(`Summary generated.`);

        // Default sentiment in case analysis fails
        let sentimentData = {
            predicted_label: "neutral",
            confidence: 0
        };

        // Analyze sentiment
        // console.log(`CONVERSATION HISTORY . USER ${conversationHistory.user} `)
        try {
            const response = await axios.post("http://localhost:8000/analyze", {
                text: summary
            });

            sentimentData = response.data;
            console.log(`Sentiment: ${sentimentData.predicted_label}`);
            console.log(`Confidence: ${sentimentData.confidence}`);
        } catch (sentimentError) {
            console.warn("Sentiment analysis failed:", sentimentError.message);
        }

        // Save to database
        try {
            // Find the user by email
            // Add the new summary and sentiment first
            const user = await User.findOne({ email: userEmail });
            if (user) {
                // Add the new summary and sentiment first
                user.conversationHistory.push({
                    summary: summary,
                    sentiment: {
                        label: sentimentData.predicted_label,
                        confidence: sentimentData.confidence
                    }
                });
            
                // Keep only the latest 4 sessions
                if (user.conversationHistory.length > 4) {
                    user.conversationHistory = user.conversationHistory.slice(-4);
                }
                user.markModified('conversationHistory');
            
                // Now check last 4 sessions
                const lastFour = user.conversationHistory.slice(-4);
                const highDistressCount = lastFour.filter(
                    (session) => session.sentiment.label && session.sentiment.label.toLowerCase().trim() === "high"
                ).length;
            
                if (highDistressCount >= 3 && lastFour.length === 4) {
                    console.log("ALERT: User has 3 or more high distress sessions out of last 4!");
                    console.log(`User Details:
                        Name: ${user.name}
                        Email: ${user.email}
                        Last 4 Summaries:
                        ${lastFour.map((s, idx) => `Session ${idx + 1}: ${s.summary}`).join("\n")}
                    `);

                    // Add the user to the admin's distressUsers array
                    try {
                        const admin = await Admin.findOne(); // Assuming you have one admin for simplicity
                        if (admin) {
                            if (!admin.distressUsers.includes(user._id)) {
                                admin.distressUsers.push(user._id);
                                await admin.save();
                                console.log(`User ${user.name} added to admin's distress list.`);
                            }
                        }
                    } catch (err) {
                        console.error("ERROR: Failed to update admin with distress user", err);
                    }

                }
            
                // Save the updated user document
                await user.save();
                console.log(`Summary and sentiment saved to database for ${userEmail}`);
            
                return summary;
            }
            else {
                console.warn(`User with email ${userEmail} not found in database`);
            }
        } catch (dbError) {
            console.error("ERROR: Failed to save to database", dbError);
        }

        return summary;
    } catch (error) {
        console.error("ERROR: Failed to summarize conversation", error);
        return "Unable to generate conversation summary due to an error.";
    }
}

module.exports = { createSummarizeChain };
