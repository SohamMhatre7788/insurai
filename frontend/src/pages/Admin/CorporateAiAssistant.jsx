import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./CorporateAiAssistant.css";
import { useAuth } from "../../context/AuthContext";

const CorporateAiAssistant = ({ userType = "ADMIN" }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [suggested, setSuggested] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const { token } = useAuth();
  const isReady = Boolean(token);

  /* ---------------- AUTO SCROLL ---------------- */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* ---------------- SUGGESTED QUESTIONS ---------------- */
  useEffect(() => {
    setSuggested(
      userType.toUpperCase() === "ADMIN"
        ? [
            "List all system policies",
            "Show premium vs coverage comparison",
            "Which policies have high risk?",
            "Create a new corporate policy",
          ]
        : [
            "Which policies do I currently have?",
            "What is my coverage amount?",
            "When does my policy expire?",
            "How can I file a claim?",
          ]
    );
  }, [userType]);

  /* ---------------- ASK AI ---------------- */
  const askAI = async (question) => {
    const text = question || input;
    if (!text.trim()) return;

    if (!isReady) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Authentication required. Please log in." },
      ]);
      return;
    }

    setMessages((prev) => [...prev, { sender: "user", text }]);
    setInput("");
    setLoading(true);

    const url =
      userType.toUpperCase() === "ADMIN"
        ? "http://localhost:8080/api/ai/admin-recommendation"
        : "http://localhost:8080/api/ai/client-recommendation";

    const payload = { input: text }; // send only the question

    try {
      const res = await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: res.data?.response || "No response from AI." },
      ]);
    } catch (err) {
      console.error("AI ERROR:", err.response?.data || err.message);

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text:
            err.response?.data?.response ||
            err.response?.data?.message ||
            "AI service failed. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="ai-root">
      <div className="ai-header">
        <h2>InsurAI Assistant</h2>
        <span className={`role-badge ${userType.toLowerCase()}`}>
          {userType.toUpperCase()}
        </span>
      </div>

      <div className="ai-body">
        {/* CHAT PANEL */}
        <div className="chat-panel">
          <div className="chat-window">
            {messages.map((m, i) => (
              <div key={`msg-${i}`} className={`chat-bubble ${m.sender}`}>
                {m.text.split("\n").map((line, idx) => (
                  <p key={`line-${idx}`}>{line}</p>
                ))}
              </div>
            ))}

            {loading && (
              <div className="chat-bubble ai typing">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          <div className="chat-input">
            <input
              placeholder="Ask about corporate insurance..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && askAI()}
              disabled={loading || !isReady}
            />
            <button onClick={() => askAI()} disabled={loading || !isReady}>
              Send
            </button>
          </div>
        </div>

        {/* SUGGESTION PANEL */}
        <div className="suggestion-panel">
          <h4>Suggested Questions</h4>
          {suggested.map((q, i) => (
            <div
              key={`suggestion-${i}`}
              className="suggestion-card"
              onClick={() => isReady && askAI(q)}
            >
              {q}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CorporateAiAssistant;
