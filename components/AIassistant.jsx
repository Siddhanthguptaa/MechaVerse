import { useState } from "react"

export default function AIAssistant() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMsg = { role: "user", text: input }
    setMessages(prev => [...prev, userMsg])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("http://localhost:3001/ai/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: input })
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || `HTTP ${res.status}`)
      }

      const data = await res.json()
      const aiMsg = { role: "ai", text: data.reply || "No response from AI" }
      setMessages(prev => [...prev, aiMsg])
    } catch (err) {
      console.error("AI Error:", err)
      const errorMsg = { role: "ai", text: `❌ Error: ${err.message}` }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {isVisible ? (
        <div style={{
          position: "absolute",
          bottom: 20,
          left: 20,
          width: 300,
          background: "#111",
          padding: 10,
          color: "#fff",
          border: "1px solid #666",
          borderRadius: 8,
          fontFamily: "monospace"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <h3 style={{ margin: 0, fontSize: 12 }}>🤖 Racing Coach</h3>
            <button 
              onClick={() => setIsVisible(false)}
              style={{
                background: "none",
                border: "none",
                color: "#f00",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: "bold"
              }}
              title="Hide"
            >
              ✕
            </button>
          </div>
          
          <div style={{ maxHeight: 200, overflowY: "auto", marginBottom: 10, fontSize: 12 }}>
            {messages.length === 0 && (
              <div style={{ color: "#666" }}>Ask for racing tips...</div>
            )}
            {messages.map((m, i) => (
              <div key={i} style={{ marginBottom: 5 }}>
                <b style={{ color: m.role === "user" ? "#0f0" : "#f80" }}>
                  {m.role === "user" ? "You:" : "Coach:"}
                </b>
                <div style={{ marginLeft: 10, fontSize: 11 }}>{m.text}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 5 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask AI..."
              disabled={loading}
              style={{ 
                flex: 1, 
                padding: 5, 
                background: "#222", 
                color: "#fff",
                border: "1px solid #444",
                fontSize: 11
              }}
            />
            <button 
              onClick={sendMessage}
              disabled={loading}
              style={{
                padding: "5px 10px",
                background: loading ? "#555" : "#f00",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: 11,
                fontWeight: "bold"
              }}
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsVisible(true)}
          style={{
            position: "absolute",
            bottom: 20,
            left: 20,
            padding: "8px 12px",
            background: "#f00",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            fontSize: 12,
            fontWeight: "bold",
            zIndex: 40
          }}
          title="Show AI Coach"
        >
          🤖 Coach
        </button>
      )}
    </>
  )
}