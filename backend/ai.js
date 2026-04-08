const express = require("express")
const router = express.Router()
const axios = require("axios")

// Validate API key
if (!process.env.OPENROUTER_API_KEY) {
  console.error("❌ ERROR: OPENROUTER_API_KEY not set")
  process.exit(1)
}

console.log("✅ OpenRouter API Key loaded successfully")

// ✅ Handle preflight requests for CORS
router.options("/ask", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "POST, OPTIONS")
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization")
  res.sendStatus(200)
})

router.post("/ask", async (req, res) => {
  try {
    const { message } = req.body

    if (!message) {
      return res.status(400).json({ error: "Message required" })
    }

    console.log(`📨 Incoming AI request: "${message}"`)

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a racing coach helping improve driving skills."
          },
          {
            role: "user",
            content: message
          }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "MechaVerse"
        }
      }
    )

    const reply = response.data.choices[0].message.content

    console.log(`✅ AI Response: "${reply.substring(0, 50)}..."`)

    res.json({ reply })

  } catch (err) {
    console.error("❌ AI ERROR:", err.response?.data || err.message)

    res.status(500).json({
      error: "AI failed"
    })
  }
})

// ✅ Handle preflight requests for health check
router.options("/health", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS")
  res.header("Access-Control-Allow-Headers", "Content-Type")
  res.sendStatus(200)
})

// Health check
router.get("/health", (req, res) => {
  res.json({ status: "AI service running" })
})

module.exports = router