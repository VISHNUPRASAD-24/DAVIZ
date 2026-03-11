import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, User, Bot, LogOut } from 'lucide-react';

import { API_BASE_URL } from '../config/api';

const ChatPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I am your DAVIZ Academic Assistant. You can ask me about your attendance, timetable, upcoming exams, or syllabus.", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const currentStudent = localStorage.getItem('daviz_current_student') || 'unknown';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message to UI
    const userText = inputValue.trim();
    const userMsg = { id: Date.now(), text: userText, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Send POST request to backend Chat API
      const res = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: userText,
          rollNo: localStorage.getItem("daviz_current_student")
        })
      });

      const data = await res.json();
      console.log("Chat API response:", data);

      let botReply = "Sorry, something went wrong.";

      if (res.ok) {
        botReply = data.reply || botReply;
      } else {
        // Handle explicit error messages from backend if they exist
        botReply = data.error || data.reply || botReply;
      }

      // Output bot message to UI
      const botMsg = { id: Date.now() + 1, text: botReply, sender: 'bot' };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Error communicating with chat backend:", error);
      let errorText = "I can't reach the college server right now. Please ensure the backend is running on port 5000.";
      
      const errorMsg = { id: Date.now() + 1, text: errorText, sender: 'bot' };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans">
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-[#0f3d3e] p-2 rounded-lg">
            <Bot size={24} className="text-yellow-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800 leading-tight">DAVIZ AI Assistant</h1>
            <p className="text-xs text-green-600 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span> Online - {currentStudent.toUpperCase()}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors font-medium text-sm px-3 py-2 rounded-md hover:bg-red-50 focus:outline-none"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50 flex justify-center">
        <div className="w-full max-w-3xl flex flex-col gap-6">
          
          {messages.map((msg) => (
             <div 
               key={msg.id} 
               className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
             >
                <div className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  
                  {/* Avatar */}
                  <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center mt-1 shadow-sm ${
                    msg.sender === 'user' ? 'bg-[#0f3d3e] text-white' : 'bg-white border border-gray-200 text-[#0f3d3e]'
                  }`}>
                    {msg.sender === 'user' ? <User size={16} /> : <Bot size={18} />}
                  </div>

                  {/* Message Bubble */}
                  <div className={`px-5 py-3.5 rounded-2xl shadow-sm text-[15px] leading-relaxed whitespace-pre-wrap ${
                    msg.sender === 'user' 
                      ? 'bg-[#0f3d3e] text-white rounded-tr-sm' 
                      : 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm'
                  }`}>
                    {msg.text}
                  </div>
                  
                </div>
             </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
             <div className="flex justify-start animate-in fade-in duration-300">
                <div className="flex gap-3 max-w-[85%] sm:max-w-[75%] flex-row">
                  <div className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center mt-1 shadow-sm bg-white border border-gray-200 text-[#0f3d3e]">
                    <Bot size={18} />
                  </div>
                  <div className="px-5 py-4 rounded-2xl shadow-sm bg-white border border-gray-100 rounded-tl-sm flex items-center gap-1.5 h-12">
                     <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                     <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                     <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
             </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="bg-white border-t border-gray-200 p-4 shrink-0">
        <form 
          onSubmit={handleSendMessage}
          className="max-w-3xl mx-auto relative flex items-center"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask anything about your academics..."
            className="w-full bg-gray-100 border-transparent focus:bg-white focus:border-[#0f3d3e] focus:ring-2 focus:ring-[#0f3d3e]/20 rounded-full py-3.5 pl-6 pr-14 outline-none transition-all shadow-sm"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className={`absolute right-2 p-2 rounded-full transition-colors flex items-center justify-center ${
              !inputValue.trim() || isTyping 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-[#0f3d3e] text-white hover:bg-[#0b2b2c] shadow-md'
            }`}
          >
            <Send size={18} className="translate-x-[1px] translate-y-[-1px]" />
          </button>
        </form>
        <div className="text-center mt-2">
           <p className="text-xs text-gray-400">Powered by MongoDB and Local DB Query Engine.</p>
        </div>
      </footer>

    </div>
  );
};

export default ChatPage;
