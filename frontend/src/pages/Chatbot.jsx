import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { MoonIcon, SunIcon } from '@heroicons/react/solid';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [endingSession, setEndingSession] = useState(false);
  const [summary, setSummary] = useState(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [showEndPrompt, setShowEndPrompt] = useState(false);
  const chatRef = useRef(null);

  function formatLLMResponse(raw) {
    const thinkStart = raw.indexOf("<think>");
    const thinkEnd = raw.indexOf("</think>");
  
    if (thinkStart !== -1 && thinkEnd !== -1 && thinkEnd > thinkStart) {
      const thinking = raw.slice(thinkStart + 7, thinkEnd).trim();
      const response = raw.slice(thinkEnd + 8).trim();
  
      return {
        response,
        think: thinking,
      };
    }
  
    // If no <think> tags, show raw
    return {
      response: raw.trim(),
      think: null,
    };
  }
  

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const newMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("https://medbot-backend.onrender.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: localStorage.getItem("userEmail"),
          query: input,
        }),
      });

      const data = await response.json();
      const botReply = {
        text: data.answer || "Sorry, I couldn't understand that!",
        sender: "bot",
      };
      setMessages((prev) => [...prev, botReply]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prev) => [...prev, { text: "Server error! Please try again.", sender: "bot" }]);
    }

    setLoading(false);
  };

  const cancelEndSession = () => {
    setShowEndPrompt(false);
    setEndingSession(false);
  };

  const confirmEndSession = () => {
    setShowEndPrompt(false);
    setEndingSession(true);
    actuallyEndSession();
  };

  const endSession = () => {
    if (endingSession) return;
    setShowEndPrompt(true);
  };

  const actuallyEndSession = async () => {
    try {
      const userEmail = localStorage.getItem("userEmail");
      if (!userEmail) return (window.location.href = "/login");

      const response = await fetch("https://medbot-backend.onrender.com/api/chat/end_session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail }),
      });

      if (!response.ok) throw new Error("Failed to end session");

      const result = await response.json();
      if (result.summary) {
        setSummary(result.summary);
        setTimeout(() => {
          window.location.href = result.redirectTo || "/login";
        }, 5000);
      } else {
        window.location.href = result.redirectTo || "/login";
      }
    } catch (error) {
      console.error("Error ending session:", error);
      alert("There was an error ending your session. Please try again.");
      setEndingSession(false);
    }
  };

  return (
    <div className="h-screen w-full">

      <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      

        {/* Summary Modal */}
        {summary && (
          <div className="w-full fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl border border-gray-100">
              <h2 className="text-2xl font-bold text-purple-700 mb-4">Conversation Summary</h2>
              <div className="max-h-60 overflow-y-auto mb-4 text-gray-700 whitespace-pre-line bg-purple-50 p-4 rounded-lg border border-purple-100">
                {summary}

              </div>
              <div className="flex items-center justify-center text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-full">
                <svg className="h-4 w-4 animate-spin mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Redirecting in 5 seconds...
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Prompt */}
        {showEndPrompt && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-80 text-center">
              <p className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Anything else I can help you with?</p>
              <div className="flex justify-center gap-4">
                <button onClick={cancelEndSession} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition">Yes</button>
                <button onClick={confirmEndSession} disabled={endingSession} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition">
                  {endingSession ? "Ending..." : "No"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-4 px-4 shadow-sm">
          <div className="flex justify-between items-center max-w-full lg:max-w-screen-md mx-auto">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg shadow-md">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold bg-gradient-to-r from-indigo-300 to-purple-500 bg-clip-text text-transparent">MedBot Assistant</h1>
            </div>

            <button onClick={toggleDarkMode} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-105 transition" title="Toggle Dark Mode">
              {darkMode ? <SunIcon className="h-5 w-5 text-yellow-400" /> : <MoonIcon className="h-5 w-5 text-gray-800" />}
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 max-w-full lg:max-w-screen-md mx-auto space-y-4">
          {/* {messages.map((msg, index) => (
            <div key={index} className={`max-w-fit max-w-[80%] px-4 py-2 rounded-lg shadow ${msg.sender === 'user' ? 'bg-indigo-500 text-white text-right ml-auto' : 'bg-gray-200 dark:bg-gray-700 text-white text-left mr-auto'}`}>
              <div className="prose dark:prose-invert max-w-full break-words">
                //how to see the msg coming here
                <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>
                  {msg.text}
                </ReactMarkdown>
              </div>
            </div>
          ))} */}
          {messages.map((msg, index) => {
  const isUser = msg.sender === 'user';
  const { response, think } = formatLLMResponse(msg.text);

  return (
    <div
      key={index}
      className={`max-w-fit max-w-[85%] px-4 py-2 rounded-lg shadow break-words
        ${isUser
          ? 'bg-indigo-500 text-white text-right ml-auto'
          : 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white text-left mr-auto'
        }`}
    >
      <div className="prose dark:prose-invert max-w-full">
        <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>
          {response}
        </ReactMarkdown>
       

        {/* Optional: display the <think> section in a faint style */}
        {think && (
          <div className="mt-2 text-sm italic opacity-90">
            <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>
              {think}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
})}
          <div ref={chatRef}></div>
        </div>

        {/* Footer */}
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-4">
          <div className="w-full max-w-full lg:max-w-screen-md mx-auto flex flex-col sm:flex-row gap-2 sm:gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
            <div className="flex gap-2 sm:gap-4 flex-col sm:flex-row w-full sm:w-auto">
              <button
                onClick={sendMessage}
                disabled={loading}
                className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
              >
                {loading ? "..." : "Send"}
              </button>
              <button
                onClick={endSession}
                disabled={endingSession}
                className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
              >
                {endingSession ? "Ending..." : "End Session"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;

