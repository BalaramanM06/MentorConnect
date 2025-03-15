import React, { useState } from "react";
import "./Help.css";
import chatbotSupportLogo from "../assets/chat-bot-icon-virtual-smart-600nw-2478937553.webp";


const Help = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const API_KEY = "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";

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "system", content: "You are a helpful support assistant." }, 
                     { role: "user", content: input }],
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      const botMessage = { sender: "bot", text: data.choices[0].message.content };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: "Oops! Something went wrong. Try again later." },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="help-container">
    <img className="chatbot-logo" src={chatbotSupportLogo} alt="Bot-Support"></img>
      <h2>AI Support</h2>

      <div className="chatbox">
        {messages.map((msg, index) => (
          <p key={index} className={msg.sender === "bot" ? "bot-msg" : "user-msg"}>
            <strong>{msg.sender === "bot" ? "🤖:" : "You:"}</strong> {msg.text}
          </p>
        ))}
        {loading && <p className="loading">🤔...</p>}
      </div>

      <div className="input-box">
        <input
          type="text"
          placeholder="Ask me anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Help;
