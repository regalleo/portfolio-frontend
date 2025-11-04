import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaRobot,
  FaTimes,
  FaPaperPlane,
  FaUser,
  FaComments,
  FaTrash,
  FaCopy,
  FaThumbsUp,
  FaThumbsDown,
  FaRedo,
  FaCircle,
} from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import { useAbout } from "../../hooks/useAPI";
import { useProjects } from "../../hooks/useAPI";
import { useExperience } from "../../hooks/useAPI";

// ✅ CORRECT WAY - Access environment variable for Vite/Create React App
const GROQ_API_KEY =
  import.meta.env.VITE_GROQ_API_KEY ||
  import.meta.env.REACT_APP_GROQ_API_KEY;

if (!GROQ_API_KEY) {
  console.warn("⚠️ GROQ_API_KEY is not set in .env file");
}
const Chatbot = () => {
  const { isDarkMode } = useTheme();
  const { data: about, isLoading: aboutLoading } = useAbout();
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: experience, isLoading: experienceLoading } = useExperience();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content:
        "👋 Hi! I'm Raj's AI assistant. I can tell you about his projects, skills, experience, or how to contact him. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Helper function to format relative time
  const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  // Function to copy message to clipboard
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Function to clear chat
  const clearChat = () => {
    setMessages([
      {
        id: 1,
        type: "bot",
        content:
          "👋 Hi! I'm Raj's AI assistant. I can tell you about his projects, skills, experience, or how to contact him. What would you like to know?",
        timestamp: new Date(),
      },
    ]);
    setError(null);
  };

  // Quick action buttons
  const quickActions = [
    { label: "About Raj", message: "Tell me about Raj's background and experience" },
    { label: "Projects", message: "What projects has Raj worked on?" },
    { label: "Skills", message: "What are Raj's technical skills?" },
    { label: "Contact", message: "How can I contact Raj?" },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Dynamic system prompt based on fetched data
  const systemPrompt = `You are Raj's AI assistant for his portfolio website. You are helpful, friendly, and knowledgeable about Raj's background, skills, projects, and experience.

About Raj:
${about ? `- ${about.name || 'Raj Shekhar Singh'}
- ${about.title || 'Software Developer & Data Engineer'}
- ${about.bio ? about.bio.split('. ').slice(0, 3).join('. ') + '.' : 'Passionate about technology and innovation, I specialize in building scalable applications and solving complex problems.'}
- Location: ${about.location || 'Bangalore, India'}
- Email: ${about.email || 'rajsingh170901@gmail.com'}` : `- Full-Stack Developer & Data Engineer with 3+ years of experience
- B.Tech EEE graduate from NIT Silchar
- Specializes in Java, Python, React, and cloud technologies
- Expertise in building scalable web applications, data pipelines, and AI solutions
- Strong experience with Spring Boot, React, MongoDB, Apache Kafka, AI/ML frameworks
- Has worked at Infosys as a System Engineer`}

${about?.expertise ? `Key Skills:
${about.expertise.split('•').map(skill => skill.trim()).filter(skill => skill).map(skill => `- ${skill}`).join('\n')}` : `Key Skills:
- Backend: Java, Python, Spring Boot, Django, FastAPI
- Frontend: React, JavaScript, HTML5, CSS3, Tailwind CSS
- Databases: MongoDB, MySQL, PostgreSQL
- Data Engineering: Apache Kafka, Apache Spark, Hadoop
- AI/ML: TensorFlow, PyTorch, LangChain, OpenAI
- Cloud: Google Cloud, AWS, Docker, Kubernetes`}

${projects ? `Projects:
${projects.slice(0, 6).map(project => `- ${project.title}: ${project.description || project.technologies || 'A featured project'}`).join('\n')}` : `Projects:
- Customer 360 Analytics Platform (React + Spring Boot)
- Task Manager Dashboard (Full-stack with Django)
- RAG-Powered AI Knowledge Assistant (LangChain + OpenAI)
- Credit Card Fraud Detection System (Python + ML)
- Tesla Stock Analysis (Data Science)
- Construction Management System`}

${experience ? `Experience:
${experience.slice(0, 5).map(exp => `- ${exp.position} at ${exp.company} (${exp.duration}): ${exp.description || 'Key role in software development'}`).join('\n')}` : `Experience:
- System Engineer at Infosys (2021-2023): Worked on enterprise applications and system integration
- Full-Stack Developer (2023-Present): Building scalable web applications and AI solutions`}

Contact:
- Email: ${about?.email || 'rajsingh170901@gmail.com'}
- Location: ${about?.location || 'Bangalore, India'}
- Always encourage using the contact form for detailed inquiries

Guidelines:
- Be conversational and friendly
- Provide accurate information about Raj's background including his education and work experience
- Encourage visitors to explore the portfolio sections
- If asked about something not related to Raj's portfolio, politely redirect to relevant topics
- Keep responses concise but informative
- Use emojis sparingly and appropriately`;

  const getAIResponse = async (userMessage) => {
    try {
      if (!GROQ_API_KEY) {
        throw new Error("Groq API Key is not configured");
      }

      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              {
                role: "system",
                content: systemPrompt,
              },
              {
                role: "user",
                content: userMessage,
              },
            ],
            max_tokens: 500,
            temperature: 0.7,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "API Error");
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error("Groq API Error:", error);
      setError("Failed to get AI response. Please try again.");
      return getFallbackResponse(userMessage);
    }
  };

  // Fallback function for when API fails
  const getFallbackResponse = (userMessage) => {
    return "I'm sorry, I'm having trouble connecting right now. Please try again in a moment!";
  };

  const handleSendMessage = async (messageText = null) => {
    const messageToSend = messageText || inputMessage.trim();
    if (!messageToSend) return;

    setInputMessage("");
    setError(null);

    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      type: "user",
      content: messageToSend,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setIsTyping(true);

    try {
      // Get AI response from Groq
      const aiResponse = await getAIResponse(messageToSend);

      const botResponse = {
        id: messages.length + 2,
        type: "bot",
        content: aiResponse,
        timestamp: new Date(),
        reactions: { thumbsUp: false, thumbsDown: false },
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorResponse = {
        id: messages.length + 2,
        type: "bot",
        content:
          "I'm sorry, I'm having trouble connecting right now. Please try again in a moment!",
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);

      // Auto-scroll to bottom after new message
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  // Handle quick action click
  const handleQuickAction = (message) => {
    handleSendMessage(message);
  };

  // Handle message reaction
  const handleReaction = (messageId, reactionType) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              reactions: {
                ...msg.reactions,
                [reactionType]: !msg.reactions?.[reactionType],
                [reactionType === 'thumbsUp' ? 'thumbsDown' : 'thumbsUp']: false,
              },
            }
          : msg
      )
    );
  };

  // Retry failed message
  const retryMessage = (messageId) => {
    const messageToRetry = messages.find(msg => msg.id === messageId - 1);
    if (messageToRetry && messageToRetry.type === 'user') {
      // Remove error message and retry
      setMessages((prev) => prev.filter(msg => msg.id !== messageId));
      handleSendMessage(messageToRetry.content);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 ${
          isDarkMode
            ? "bg-gradient-to-r from-cyan-500 to-purple-600 hover:shadow-cyan-500/50"
            : "bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-blue-500/50"
        }`}
        aria-label="Open chat assistant"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <FaTimes className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <FaComments className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`fixed bottom-24 right-6 z-40 w-96 h-[500px] rounded-2xl shadow-2xl overflow-hidden ${
              isDarkMode
                ? "bg-gray-900/95 backdrop-blur-xl border border-cyan-500/30"
                : "bg-white/95 backdrop-blur-xl border border-blue-300/40"
            }`}
          >
            {/* Header */}
            <div
              className={`p-4 border-b ${
                isDarkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-full ${
                      isDarkMode ? "bg-cyan-500/20" : "bg-blue-100"
                    }`}
                  >
                    <FaRobot
                      className={`w-5 h-5 ${
                        isDarkMode ? "text-cyan-400" : "text-blue-600"
                      }`}
                    />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3
                        className={`font-semibold ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        AI Assistant
                      </h3>
                      <FaCircle className="w-2 h-2 text-green-500" />
                    </div>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Online • Ask me anything!
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={clearChat}
                  className={`p-2 rounded-lg transition-colors ${
                    isDarkMode
                      ? "hover:bg-gray-700 text-gray-400 hover:text-gray-200"
                      : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                  }`}
                  title="Clear chat"
                >
                  <FaTrash className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[350px]">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex space-x-2 max-w-[80%] ${
                      message.type === "user"
                        ? "flex-row-reverse space-x-reverse"
                        : ""
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        message.type === "bot"
                          ? isDarkMode
                            ? "bg-cyan-500/20"
                            : "bg-blue-100"
                          : isDarkMode
                          ? "bg-purple-500/20"
                          : "bg-purple-100"
                      }`}
                    >
                      {message.type === "bot" ? (
                        <FaRobot
                          className={`w-4 h-4 ${
                            isDarkMode ? "text-cyan-400" : "text-blue-600"
                          }`}
                        />
                      ) : (
                        <FaUser
                          className={`w-4 h-4 ${
                            isDarkMode ? "text-purple-400" : "text-purple-600"
                          }`}
                        />
                      )}
                    </div>
                    <div
                      className={`px-4 py-3 rounded-2xl shadow-sm ${
                        message.type === "user"
                          ? isDarkMode
                            ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white"
                            : "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                          : isDarkMode
                          ? "bg-gray-800 text-gray-200 border border-gray-700"
                          : "bg-gray-100 text-gray-800 border border-gray-200"
                      }`}
                    >
                      <div className="text-sm whitespace-pre-line">
                        {message.content}
                      </div>
                      <p
                        className={`text-xs mt-2 ${
                          message.type === "user"
                            ? "text-white/70"
                            : isDarkMode
                            ? "text-gray-400"
                            : "text-gray-500"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-center"
                >
                  <div
                    className={`px-4 py-2 rounded-lg text-sm ${
                      isDarkMode
                        ? "bg-red-500/20 text-red-300 border border-red-500/30"
                        : "bg-red-100 text-red-700 border border-red-300"
                    }`}
                  >
                    {error}
                  </div>
                </motion.div>
              )}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex space-x-2 max-w-[80%]">
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        isDarkMode ? "bg-cyan-500/20" : "bg-blue-100"
                      }`}
                    >
                      <FaRobot
                        className={`w-4 h-4 ${
                          isDarkMode ? "text-cyan-400" : "text-blue-600"
                        }`}
                      />
                    </div>
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        isDarkMode ? "bg-gray-800" : "bg-gray-100"
                      }`}
                    >
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div
              className={`p-4 border-t ${
                isDarkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <div className="flex space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about Raj's projects, skills, or experience..."
                  className={`flex-1 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:ring-cyan-400 focus:border-cyan-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-400 focus:border-blue-400"
                  }`}
                  disabled={isTyping}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className={`p-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isDarkMode
                      ? "bg-gradient-to-r from-cyan-500 to-purple-600 hover:shadow-cyan-500/50"
                      : "bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-blue-500/50"
                  }`}
                >
                  {isTyping ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <FaPaperPlane className="w-4 h-4 text-white" />
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
