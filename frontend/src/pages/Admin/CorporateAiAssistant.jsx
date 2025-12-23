import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./CorporateAiAssistant.css";

const CorporateAiAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const suggestedQuestions = [
    "What insurance is required for corporate employees?",
    "What insurance covers office fire or property damage?",
    "How can a company protect against cyber risks?",
    "What insurance covers office fire damage?"
  ];

  const handleAskAI = async (question) => {
    const text = question || input;
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/ai/corporate-recommendation",
        { input: text }
      );

      const aiText =
        response.data.response ||
        "I couldn’t generate an answer right now. Please try again.";

      setMessages((prev) => [...prev, { sender: "ai", text: aiText }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Sorry, something went wrong. Please try again." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-page">
      {/* Chat Section */}
      <div className="chat-wrapper">
        <div className="chat-section">
          <h2>InsurAI – Corporate Insurance Assistant</h2>
          <div className="chat-window">
      {messages.map((msg, index) => (
  <div
    key={index}
    className={`chat-message ${msg.sender === "user" ? "user" : "ai"}`}
  >
    {msg.sender === "ai"
      ? msg.text.split("\n").map((line, i) => (
          <p key={i} style={{ margin: "4px 0" }}>{line}</p>
        ))
      : msg.text
    }
  </div>
))}

            {loading && (
              <div className="chat-message typing">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="chat-input">
            <input
              type="text"
              placeholder="Ask about corporate insurance..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAskAI()}
              disabled={loading}
            />
            <button onClick={() => handleAskAI()} disabled={loading}>
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Suggested Questions Sidebar */}
      <div className="sidebar">
        <h3>Suggested Questions</h3>
        {suggestedQuestions.map((q, index) => (
          <div
            key={index}
            className="suggested-card"
            onClick={() => handleAskAI(q)}
          >
            {q}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CorporateAiAssistant;
