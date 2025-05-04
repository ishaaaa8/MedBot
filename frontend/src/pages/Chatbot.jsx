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
    <div className="h-screen">
      <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300">

        {/* Summary Modal */}
        {summary && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
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
          {messages.map((msg, index) => (
            <div key={index} className={`max-w-fit max-w-[80%] px-4 py-2 rounded-lg shadow ${msg.sender === 'user' ? 'bg-indigo-500 text-white text-right ml-auto' : 'bg-gray-200 dark:bg-gray-700 text-white text-left mr-auto'}`}>
              <div className="prose dark:prose-invert max-w-full break-words">
                <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>
                  {msg.text}
                </ReactMarkdown>
              </div>
            </div>
          ))}
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




// import { useState, useEffect, useRef } from "react";
// import ReactMarkdown from 'react-markdown';
// import rehypeRaw from 'rehype-raw'; 
// import remarkGfm from 'remark-gfm';

// const Chatbot = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [endingSession, setEndingSession] = useState(false);
//   const [summary, setSummary] = useState(null);
//   const [darkMode, setDarkMode] = useState(false);
//   const chatRef = useRef(null);

//   useEffect(() => {
//     // Check if user has a dark mode preference in localStorage
//     const isDarkMode = localStorage.getItem('darkMode') === 'true';
//     setDarkMode(isDarkMode);
//   }, []);

//   useEffect(() => {
//     chatRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const sendMessage = async () => {
//     if (!input.trim() || loading) return;

//     const newMessage = { text: input, sender: "user" };
//     setMessages((prev) => [...prev, newMessage]);
//     setInput("");
//     setLoading(true);

//     try {
//       const response = await fetch("https://medbot-backend.onrender.com/api/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userEmail: localStorage.getItem("userEmail"), query: input }),
//       });

//       const data = await response.json();
//       const botReply = {
//         text: data.answer || "Sorry, I couldn't understand that!",
//         sender: "bot"
//       };
//       setMessages((prev) => [...prev, botReply]);
//     } catch (error) {
//       console.error("Error fetching response:", error);
//       setMessages((prev) => [...prev, { text: " Server error! Please try again.", sender: "bot" }]);
//     }
//     setLoading(false);
//   };

//   const endSession = async () => {
//     if (endingSession) return;
//     // add a pop asking " Anything else I can help you with? " , and a yes / no option .. if yes is clicked end sesion will not proceed but if no then procees ahead in this function
//     setEndingSession(true);

//     try {
//       const userEmail = localStorage.getItem("userEmail");

//       if (!userEmail) {
//         console.error("No user email found");
//         window.location.href = "/login";
//         return;
//       }

//       const response = await fetch("https://medbot-backend.onrender.com/api/chat/end_session", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userEmail }),
//       });

//       if (!response.ok) throw new Error("Failed to end session");

//       const result = await response.json();
//       if (result.summary) {
//         setSummary(result.summary);
//         setTimeout(() => {
//           window.location.href = result.redirectTo || "/login";
//         }, 5000);
//       } else {
//         window.location.href = result.redirectTo || "/login";
//       }
//     } catch (error) {
//       console.error("Error ending session:", error);
//       alert("There was an error ending your session. Please try again.");
//       setEndingSession(false);
//     }
//   };

//   const toggleDarkMode = () => {
//     const newDarkMode = !darkMode;
//     setDarkMode(newDarkMode);
//     localStorage.setItem('darkMode', newDarkMode);
//   };

//   // Apply dark mode class to document.documentElement (html tag)
//   useEffect(() => {
//     if (darkMode) {
//       document.documentElement.classList.add('dark');
//     } else {
//       document.documentElement.classList.remove('dark');
//     }
//   }, [darkMode]);

//   return (
//     <div className="h-screen">
//       <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
//          {/* Summary Modal - Shown when ending session */}
//       {summary && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
//           <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl border border-gray-100">
//             <div className="flex items-center gap-2 mb-4">
//               <div className="bg-purple-100 p-2 rounded-full">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                 </svg>
//               </div>
//               <h2 className="text-2xl font-bold text-purple-700">Conversation Summary</h2>
//             </div>
//             <div className="max-h-60 overflow-y-auto mb-4 text-gray-700 whitespace-pre-line bg-purple-50 p-4 rounded-lg border border-purple-100">
//               {summary}
//             </div>
//             <div className="flex items-center justify-center">
//               <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-full">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                 </svg>
//                 <p>Redirecting in 5 seconds...</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
        
//         {/* Summary Modal
//         {summary && (
//           <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
//             <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl border border-gray-200 dark:border-gray-700">
//               <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-400 mb-4">Conversation Summary</h2>
//               <div className="max-h-60 overflow-y-auto mb-4 text-gray-700 dark:text-gray-300 whitespace-pre-line bg-purple-50 dark:bg-gray-700 p-4 rounded-lg border border-purple-100 dark:border-purple-400">
//                 {summary}
//               </div>
//               <div className="flex items-center justify-center">
//                 <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-full">
//                   <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                   </svg>
//                   <p>Redirecting in 5 seconds...</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )} */}

//         {/* Chat Header */}
//         <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-4 px-6 shadow-sm">
//           <div className="max-w-screen-lg mx-auto flex justify-between items-center">
//             <div className="flex items-center gap-3">
//               <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg shadow-md">
//                 <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
//                 </svg>
//               </div>
//               <h1 className="text-xl font-semibold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">MedBot Assistant</h1>
//             </div>

//             <div className="flex items-center gap-4">
//               {/* Dark Mode Toggle */}
//               <button onClick={toggleDarkMode} className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition">
//                 {darkMode ? (
//                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.485-8.485l.707.707M3.515 3.515l.707.707M21 12h1M3 12H2m16.485 4.485l.707.707M3.515 20.485l.707-.707M12 5a7 7 0 000 14a7 7 0 000-14z" />
//                   </svg>
//                 ) : (
//                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
//                   </svg>
//                 )}
//               </button>

//               {/* End Session Button */}
//               <button
//                 onClick={endSession}
//                 className={`py-2 px-4 rounded-lg font-medium transition duration-300 flex items-center gap-2 ${
//                   endingSession 
//                     ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed" 
//                     : "bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg"
//                 }`}
//                 disabled={endingSession}
//               >
//                 <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//                 </svg>
//                 {endingSession ? "Ending..." : "End Session"}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Chat Body */}
//         <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-screen-lg w-full mx-auto">
//           {messages.length === 0 && (
//             <div className="h-full flex items-center justify-center">
//               <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 max-w-md">
//                 <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-3 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
//                   <svg className="h-8 w-8 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
//                   </svg>
//                 </div>
//                 <p className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Welcome to MedBot Assistant</p>
//                 <p className="text-gray-500 dark:text-gray-400">Ask me anything about your health concerns or medical questions</p>
//               </div>
//             </div>
//           )}

//           {messages.map((msg, index) => (
//             <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
//               <div className={`px-4 py-2 rounded-lg max-w-xs text-sm ${
//                 msg.sender === "user" 
//                   ? "bg-indigo-500 text-white" 
//                   : "bg-gray-200 dark:bg-gray-700 dark:text-gray-100"
//               }`}>
//                 {/* <ReactMarkdown>{msg.text}</ReactMarkdown> */}
//                 <ReactMarkdown
//                     remarkPlugins={[remarkGfm]}
//                     rehypePlugins={[rehypeRaw]}
//                     components={{
//                       h3: ({node, ...props}) => <h3 className="text-lg font-semibold mt-2 mb-1 text-purple-700" {...props} />,
//                       ul: ({node, ...props}) => <ul className="list-disc list-inside mb-2 text-gray-800 dark:text-gray-200" {...props} />,
//                       p: ({node, ...props}) => <p className="mb-2 text-sm text-gray-900 dark:text-gray-100" {...props} />,
//                       blockquote: ({node, ...props}) => <blockquote className="border-l-4 pl-3 italic text-gray-600 dark:text-gray-300" {...props} />
//                     }}
// >
//   {msg.text}
// </ReactMarkdown>
//               </div>
//             </div>
//           ))}
//           <div ref={chatRef} />
//         </div>

//         {/* Input Field */}
//         <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
//           <div className="max-w-screen-lg mx-auto flex gap-4">
//             <input
//               type="text"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//               placeholder="Type your message..."
//               className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
//             />
//             <button
//               onClick={sendMessage}
//               disabled={loading}
//               className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 transition"
//             >
//               {loading ? "Sending..." : "Send"}
//             </button>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Chatbot;


// // import { useState, useEffect, useRef } from "react";

// // const Chatbot = () => {
// //   const [messages, setMessages] = useState([]);
// //   const [input, setInput] = useState("");
// //   const [loading, setLoading] = useState(false);
// //   const [endingSession, setEndingSession] = useState(false);
// //   const [summary, setSummary] = useState(null);
// //   const chatRef = useRef(null);

// //   // Auto-scroll to the latest message
// //   useEffect(() => {
// //     chatRef.current?.scrollIntoView({ behavior: "smooth" });
// //   }, [messages]);

// //   const sendMessage = async () => {
// //     if (!input.trim() || loading) return;

// //     const newMessage = { text: input, sender: "user" };
// //     setMessages((prev) => [...prev, newMessage]);
// //     setInput("");
// //     setLoading(true);

// //     try {
// //       const response = await fetch("http://localhost:5000/api/chat", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ userEmail: localStorage.getItem("userEmail"), query: input }),
// //       });

// //       const data = await response.json();
// //       console.log("Raw response from backend:", data);

// //       const botReply = { 
// //         text: data.answer || "🤖 Sorry, I couldn't understand that!", 
// //         sender: "bot" 
// //       };

// //       setMessages((prev) => [...prev, botReply]);
// //     } catch (error) {
// //       console.error("Error fetching response:", error);
// //       setMessages((prev) => [...prev, { text: "❌ Server error! Please try again.", sender: "bot" }]);
// //     }

// //     setLoading(false);
// //   };

// //   // Handle end session
// //   const endSession = async () => {
// //     if (endingSession) return;
    
// //     setEndingSession(true);
    
// //     try {
// //       const userEmail = localStorage.getItem("userEmail");
      
// //       if (!userEmail) {
// //         console.error("No user email found in local storage");
// //         window.location.href = "/login";
// //         return;
// //       }
// //       // 
// //       const response = await fetch("http://localhost:5000/api/chat/end_session", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ userEmail }),
// //       });
      
// //       if (!response.ok) {
// //         throw new Error("Failed to end session");
// //       }
      
// //       const result = await response.json();
// //       console.log("End session response:", result);
      
// //       if (result.summary) {
// //         setSummary(result.summary);
        
// //         // Redirect after showing summary for 5 seconds
// //         setTimeout(() => {
// //           window.location.href = result.redirectTo || "/login";
// //         }, 5000);
// //       } else {
// //         // Redirect immediately if no summary
// //         window.location.href = result.redirectTo || "/login";
// //       }
      
// //     } catch (error) {
// //       console.error("Error ending session:", error);
// //       alert("There was an error ending your session. Please try again.");
// //       setEndingSession(false);
// //     }
// //   };

// //   return (
// //     <div className="h-screen flex flex-col bg-gray-50">
// //       {/* Summary Modal - Shown when ending session */}
// //       {summary && (
// //         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
// //           <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl border border-gray-100">
// //             <div className="flex items-center gap-2 mb-4">
// //               <div className="bg-purple-100 p-2 rounded-full">
// //                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
// //                 </svg>
// //               </div>
// //               <h2 className="text-2xl font-bold text-purple-700">Conversation Summary</h2>
// //             </div>
// //             <div className="max-h-60 overflow-y-auto mb-4 text-gray-700 whitespace-pre-line bg-purple-50 p-4 rounded-lg border border-purple-100">
// //               {summary}
// //             </div>
// //             <div className="flex items-center justify-center">
// //               <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-full">
// //                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
// //                 </svg>
// //                 <p>Redirecting in 5 seconds...</p>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Chat Header */}
// //       <div className="bg-white border-b border-gray-200 py-4 px-6 shadow-sm">
// //         <div className="max-w-screen-lg mx-auto flex justify-between items-center">
// //           <div className="flex items-center gap-3">
// //             <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg shadow-md">
// //               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
// //               </svg>
// //             </div>
// //             <h1 className="text-xl font-semibold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">MedBot Assistant</h1>
// //           </div>
// //           <button 
// //             onClick={endSession}
// //             className={`py-2 px-4 rounded-lg font-medium transition duration-300 flex items-center gap-2 ${
// //               endingSession 
// //                 ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
// //                 : "bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg"
// //             }`}
// //             disabled={endingSession}
// //           >
// //             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
// //             </svg>
// //             {endingSession ? "Ending..." : "End Session"}
// //           </button>
// //         </div>
// //       </div>

// //       {/* Chat Body */}
// //       <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-screen-lg w-full mx-auto">
// //         {messages.length === 0 && (
// //           <div className="h-full flex items-center justify-center">
// //             <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-100 max-w-md">
// //               <div className="bg-blue-100 rounded-full p-3 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
// //                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
// //                 </svg>
// //               </div>
// //               <p className="text-xl font-semibold text-gray-800 mb-2">Welcome to MedBot Assistant</p>
// //               <p className="text-gray-500">Ask me anything about your health concerns or medical questions</p>
// //             </div>
// //           </div>
// //         )}
        
// //         {messages.map((msg, index) => (
// //           <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
// //             <div 
// //               className={`max-w-xs sm:max-w-md p-4 rounded-2xl shadow-sm ${
// //                 msg.sender === "user" 
// //                   ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white" 
// //                   : "bg-white border border-gray-200 text-gray-800"
// //               }`}
// //             >
// //               {msg.text}
// //             </div>
// //           </div>
// //         ))}

// //         {loading && (
// //           <div className="flex justify-start">
// //             <div className="max-w-xs sm:max-w-md p-4 rounded-2xl shadow-sm bg-white border border-gray-200">
// //               <div className="flex space-x-2">
// //                 <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
// //                 <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
// //                 <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
// //               </div>
// //             </div>
// //           </div>
// //         )}

// //         <div ref={chatRef}></div>
// //       </div>

// //       {/* Chat Input */}
// //       <div className="bg-white p-4 border-t border-gray-200">
// //         <div className="max-w-screen-lg mx-auto flex items-center gap-2">
// //           <div className="flex-1 relative">
// //             <input
// //               type="text"
// //               className="w-full border border-gray-300 rounded-full py-3 px-5 pr-12 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
// //               placeholder="Type your message..."
// //               value={input}
// //               onChange={(e) => setInput(e.target.value)}
// //               onKeyDown={(e) => e.key === "Enter" && sendMessage()}
// //               disabled={loading || endingSession}
// //             />
// //           </div>
// //           <button 
// //             onClick={sendMessage} 
// //             className={`p-3 rounded-full text-white transition duration-300 flex items-center justify-center ${
// //               loading || endingSession || !input.trim() 
// //                 ? "bg-blue-300 cursor-not-allowed" 
// //                 : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg"
// //             }`}
// //             disabled={loading || endingSession || !input.trim()}
// //           >
// //             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
// //             </svg>
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Chatbot;



// // // code 2 working
// // // import { useState, useEffect, useRef } from "react";

// // // const Chatbot = () => {
// // //   const [messages, setMessages] = useState([]);
// // //   const [input, setInput] = useState("");
// // //   const [loading, setLoading] = useState(false);
// // //   const [endingSession, setEndingSession] = useState(false);
// // //   const [summary, setSummary] = useState(null);
// // //   const chatRef = useRef(null);

// // //   // Auto-scroll to the latest message
// // //   useEffect(() => {
// // //     chatRef.current?.scrollIntoView({ behavior: "smooth" });
// // //   }, [messages]);

// // //   const sendMessage = async () => {
// // //     if (!input.trim() || loading) return;

// // //     const newMessage = { text: input, sender: "user" };
// // //     setMessages((prev) => [...prev, newMessage]);
// // //     setInput("");
// // //     setLoading(true);

// // //     try {
// // //       const response = await fetch("http://localhost:5000/api/chat", {
// // //         method: "POST",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify({ userEmail: localStorage.getItem("userEmail"), query: input }),
// // //       });

// // //       const data = await response.json();
// // //       console.log("Raw response from backend:", data);

// // //       const botReply = { 
// // //         text: data.answer || "🤖 Sorry, I couldn't understand that!", 
// // //         sender: "bot" 
// // //       };

// // //       setMessages((prev) => [...prev, botReply]);
// // //     } catch (error) {
// // //       console.error("Error fetching response:", error);
// // //       setMessages((prev) => [...prev, { text: "❌ Server error! Please try again.", sender: "bot" }]);
// // //     }

// // //     setLoading(false);
// // //   };

// // //   // Handle end session
// // //   const endSession = async () => {
// // //     if (endingSession) return;
    
// // //     setEndingSession(true);
    
// // //     try {
// // //       const userEmail = localStorage.getItem("userEmail");
      
// // //       if (!userEmail) {
// // //         console.error("No user email found in local storage");
// // //         window.location.href = "/login";
// // //         return;
// // //       }
      
// // //       const response = await fetch("http://localhost:5000/api/chat/end_session", {
// // //         method: "POST",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify({ userEmail }),
// // //       });
      
// // //       if (!response.ok) {
// // //         throw new Error("Failed to end session");
// // //       }
      
// // //       const result = await response.json();
// // //       console.log("End session response:", result);
      
// // //       if (result.summary) {
// // //         setSummary(result.summary);
        
// // //         // Redirect after showing summary for 5 seconds
// // //         setTimeout(() => {
// // //           window.location.href = result.redirectTo || "/login";
// // //         }, 5000);
// // //       } else {
// // //         // Redirect immediately if no summary
// // //         window.location.href = result.redirectTo || "/login";
// // //       }
      
// // //     } catch (error) {
// // //       console.error("Error ending session:", error);
// // //       alert("There was an error ending your session. Please try again.");
// // //       setEndingSession(false);
// // //     }
// // //   };

// // //   return (
// // //     <div className="h-screen flex flex-col bg-gray-100">
// // //       {/* Summary Modal - Shown when ending session */}
// // //       {summary && (
// // //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
// // //           <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
// // //             <h2 className="text-2xl font-bold mb-4 text-purple-700">Your Conversation Summary</h2>
// // //             <div className="max-h-60 overflow-y-auto mb-4 text-gray-700 whitespace-pre-line">
// // //               {summary}
// // //             </div>
// // //             <p className="text-sm italic text-gray-500">Redirecting to login page in 5 seconds...</p>
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* Chat Header */}
// // //       <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-4 shadow-lg flex justify-between items-center">
// // //         <h1 className="text-xl font-semibold">AI Chat Assistant 🤖</h1>
// // //         <button 
// // //           onClick={endSession}
// // //           className={`py-2 px-4 rounded-lg font-medium transition duration-300 ${
// // //             endingSession 
// // //               ? "bg-gray-400 cursor-not-allowed" 
// // //               : "bg-red-500 hover:bg-red-600 text-white"
// // //           }`}
// // //           disabled={endingSession}
// // //         >
// // //           {endingSession ? "Ending..." : "End Session"}
// // //         </button>
// // //       </div>

// // //       {/* Chat Body */}
// // //       <div className="flex-1 overflow-y-auto p-4 space-y-3">
// // //         {messages.length === 0 && (
// // //           <div className="h-full flex items-center justify-center">
// // //             <div className="text-center text-gray-500">
// // //               <p className="text-xl mb-2">👋 Welcome to the Medical Assistant</p>
// // //               <p className="text-sm">Start a conversation by typing a message below</p>
// // //             </div>
// // //           </div>
// // //         )}
        
// // //         {messages.map((msg, index) => (
// // //           <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
// // //             <div className={`max-w-xs sm:max-w-md p-3 rounded-xl shadow-md text-white ${msg.sender === "user" ? "bg-blue-500" : "bg-purple-600"}`}>
// // //               {msg.text}
// // //             </div>
// // //           </div>
// // //         ))}

// // //         {loading && (
// // //           <div className="flex justify-start">
// // //             <div className="max-w-xs sm:max-w-md p-3 rounded-xl shadow-md bg-purple-600 text-white">
// // //               <span className="animate-pulse">Thinking...</span>
// // //             </div>
// // //           </div>
// // //         )}

// // //         <div ref={chatRef}></div>
// // //       </div>

// // //       {/* Chat Input */}
// // //       <div className="bg-white p-4 flex items-center border-t shadow-lg">
// // //         <input
// // //           type="text"
// // //           className="flex-1 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
// // //           placeholder="Type your message..."
// // //           value={input}
// // //           onChange={(e) => setInput(e.target.value)}
// // //           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
// // //           disabled={loading || endingSession}
// // //         />
// // //         <button 
// // //           onClick={sendMessage} 
// // //           className={`ml-3 px-6 py-3 rounded-lg text-white font-medium transition duration-300 ${
// // //             loading || endingSession ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700"
// // //           }`}
// // //           disabled={loading || endingSession}
// // //         >
// // //           {loading ? "Sending..." : "Send 🚀"}
// // //         </button>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default Chatbot;


// // //code 1

// // // import { useState, useEffect, useRef } from "react";

// // // const Chatbot = () => {
// // //   const [messages, setMessages] = useState([]);
// // //   const [input, setInput] = useState("");
// // //   const [loading, setLoading] = useState(false);
// // //   const chatRef = useRef(null);

// // //   // Auto-scroll to the latest message
// // //   useEffect(() => {
// // //     chatRef.current?.scrollIntoView({ behavior: "smooth" });
// // //   }, [messages]);

// // //   const sendMessage = async () => {
// // //     if (!input.trim() || loading) return;

// // //     const newMessage = { text: input, sender: "user" };
// // //     setMessages((prev) => [...prev, newMessage]);
// // //     setInput("");
// // //     setLoading(true);

// // //     try {
// // //       const response = await fetch("http://localhost:5000/api/chat", {
// // //         method: "POST",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify({ userEmail: localStorage.getItem("userEmail"), query: input }),
// // //       });

// // //       const data = await response.json();
// // //       console.log("Raw response from backend:", data);

// // //       const botReply = { 
// // //         text: data.answer || "🤖 Sorry, I couldn't understand that!", 
// // //         sender: "bot" 
// // //       };

// // //       setMessages((prev) => [...prev, botReply]);
// // //     } catch (error) {
// // //       console.error("Error fetching response:", error);
// // //       setMessages((prev) => [...prev, { text: "❌ Server error! Please try again.", sender: "bot" }]);
// // //     }

// // //     setLoading(false);
// // //   };

// // //   return (
// // //     <div className="h-screen flex flex-col bg-gray-100">
// // //       {/* Chat Header */}
// // //       <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center py-4 text-xl font-semibold shadow-lg">
// // //         AI Chat Assistant 🤖
// // //       </div>

// // //       {/* Chat Body */}
// // //       <div className="flex-1 overflow-y-auto p-4 space-y-3">
// // //         {messages.map((msg, index) => (
// // //           <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
// // //             <div className={`max-w-xs sm:max-w-md p-3 rounded-xl shadow-md text-white ${msg.sender === "user" ? "bg-blue-500" : "bg-purple-600"}`}>
// // //               {msg.text}
// // //             </div>
// // //           </div>
// // //         ))}

// // //         {loading && (
// // //           <div className="flex justify-start">
// // //             <div className="max-w-xs sm:max-w-md p-3 rounded-xl shadow-md bg-purple-600 text-white">
// // //               <span className="animate-pulse">Thinking...</span>
// // //             </div>
// // //           </div>
// // //         )}

// // //         <div ref={chatRef}></div>
// // //       </div>

// // //       {/* Chat Input */}
// // //       <div className="bg-white p-4 flex items-center border-t shadow-lg">
// // //         <input
// // //           type="text"
// // //           className="flex-1 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
// // //           placeholder="Type your message..."
// // //           value={input}
// // //           onChange={(e) => setInput(e.target.value)}
// // //           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
// // //           disabled={loading}
// // //         />
// // //         <button 
// // //           onClick={sendMessage} 
// // //           className={`ml-3 px-6 py-3 rounded-lg text-white font-medium transition duration-300 ${
// // //             loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700"
// // //           }`}
// // //           disabled={loading}
// // //         >
// // //           {loading ? "Sending..." : "Send 🚀"}
// // //         </button>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default Chatbot;
