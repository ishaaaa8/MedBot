import { useState, useEffect, useRef } from "react";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: localStorage.getItem("userEmail") , query: input }),
      });

      const data = await response.json();
      console.log("Raw response from backend:", data);
      const botReply = { text: data.answer || "🤖 Error getting response!", sender: "bot" };

      setMessages((prev) => [...prev, botReply]);
    } catch (error) {
      setMessages((prev) => [...prev, { text: "❌ Error connecting to server!", sender: "bot" }]);
    }

    setLoading(false);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center py-4 text-xl font-semibold shadow-lg">
        AI Chat Assistant 🤖
      </div>

      {/* Chat Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-xs sm:max-w-md p-3 rounded-xl shadow-md text-white ${msg.sender === "user" ? "bg-blue-500" : "bg-purple-600"}`}>
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="max-w-xs sm:max-w-md p-3 rounded-xl shadow-md bg-purple-600 text-white">
              <span className="animate-pulse">...</span>
            </div>
          </div>
        )}

        <div ref={chatRef}></div>
      </div>

      {/* Chat Input */}
      <div className="bg-white p-4 flex items-center border-t shadow-lg">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} className="ml-3 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          Send 🚀
        </button>
      </div>
    </div>
  );
};

export default Chatbot;