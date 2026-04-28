const express = require('express');
const router = express.Router();
const axios = require('axios');

// 🔍 INTENT DETECTION FUNCTION
const detectIntent = (text) => {
    const q = text.toLowerCase();

    if (q.includes("fire")) return "fire";
    if (q.includes("doctor") || q.includes("medical")) return "medical";
    if (q.includes("accident")) return "accident";
    if (q.includes("disaster")) return "disaster";
    if (q.includes("food")) return "food";
    if (q.includes("help")) return "general";

    return "ai";
};

router.post('/ask', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt || prompt.trim() === "") {
            return res.status(400).json({ message: "Prompt is required" });
        }

        const intent = detectIntent(prompt);

        // 🚨 PRIORITY: EMERGENCY SHORTCUTS (NO NEED AI CALL)
        if (intent === "fire") {
            return res.json({
                type: "emergency",
                intent: "fire",
                reply: "🔥 Fire emergency detected. Please trigger SOS immediately."
            });
        }

        if (intent === "medical") {
            return res.json({
                type: "help",
                intent: "medical",
                reply: "🏥 Medical help detected. Showing nearby NGOs."
            });
        }

        if (intent === "accident") {
            return res.json({
                type: "emergency",
                intent: "accident",
                reply: "🚗 Accident detected. Please stay safe and trigger SOS."
            });
        }

        if (intent === "food") {
            return res.json({
                type: "help",
                intent: "food",
                reply: "🍲 Food support detected. Showing NGOs."
            });
        }

        // 🤖 NORMAL GEMINI AI CALL
        const aiResponse = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        parts: [{ text: prompt }]
                    }
                ]
            }
        );

        const reply =
            aiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "No response from AI";

        return res.json({
            type: "ai",
            intent: "general",
            reply
        });

    } catch (error) {
        console.error("Gemini Error:", error.message);

        res.status(500).json({
            type: "error",
            message: "AI service failed"
        });
    }
});

module.exports = router;