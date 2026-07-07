import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Mic, Volume2, ArrowRight, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  sender: 'user' | 'ai';
  text: string;
  redirect?: string;
  suggestedFields?: any;
}

export const AiChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: 'Namaste! I am your Nivaran companion. You can ask me details about PM-KISAN, Ayushman Bharat, or PMAY. I can also help you file a civic complaint or detect your language!'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg: Message = { sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: messages.map(m => ({
            role: m.sender === 'user' ? 'user' : 'model',
            text: m.text
          }))
        })
      });

      if (!response.ok) throw new Error('Backend not reachable');
      const data = await response.json();

      if (data.success) {
        setMessages(prev => [...prev, {
          sender: 'ai',
          text: data.reply,
          redirect: data.redirect,
          suggestedFields: data.suggestedFields
        }]);

        if (data.detectedLanguage && data.detectedLanguage !== 'en') {
          toast.info(`Language Detected: ${data.detectedLanguage.toUpperCase()}`, {
            description: `Nivaran translated and responded in your language.`,
            duration: 4000
          });
        }
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (err) {
      console.error(err);
      // Fallback for Demo Mode when backend is down
      const isComplaint = textToSend.toLowerCase().includes('complaint') || textToSend.toLowerCase().includes('issue');
      
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: isComplaint 
          ? "I understand you want to report an issue. I can help you route this to the correct department immediately."
          : "I am operating in Demo Mode. PM-KISAN provides ₹6,000/year to eligible farmers, and Ayushman Bharat offers up to ₹5 Lakh in health insurance! What would you like to know?",
        redirect: isComplaint ? 'report' : undefined
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  // Text-To-Speech
  const handleTTS = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel active speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text.replace(/\[.*?\]/g, '')); // remove source labels
      
      // Auto detect language prefix
      if (text.includes('लाभ:') || text.includes('पात्रता:')) {
        utterance.lang = 'hi-IN'; // Hindi
      } else if (text.includes('பலன்கள்:') || text.includes('தகுதி:')) {
        utterance.lang = 'ta-IN'; // Tamil
      } else {
        utterance.lang = 'en-IN'; // Indian English
      }

      window.speechSynthesis.speak(utterance);
      toast.success('Audio playback started');
    } else {
      toast.error('Text-to-speech is not supported in this browser');
    }
  };

  // Speech-To-Text (Mock Audio upload)
  const handleStartSTT = async () => {
    if (recording) return;

    setRecording(true);
    toast.info('Recording voice note...', {
      description: 'Speak now into your microphone.',
      duration: 3000
    });

    // Simulate 3 seconds recording
    setTimeout(async () => {
      setRecording(false);
      setLoading(true);
      try {
        const response = await fetch('/api/ai/stt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        if (data.success) {
          setInput(data.transcript);
          toast.success('Voice note transcribed successfully!');
        } else {
          toast.error('Failed to transcribe audio note.');
        }
      } catch (err) {
        console.error(err);
        toast.error('Audio processing failed.');
      } finally {
        setLoading(false);
      }
    }, 2500);
  };

  const triggerRedirect = (redirect: string, fields: any) => {
    toast.success(`Redirecting to ${redirect.toUpperCase()} wizard`, {
      description: `Auto-filled details: Category - ${fields?.category || 'General'}`,
      duration: 5000
    });
    // Toggle chat closed
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-r from-saffron to-orange-500 rounded-full flex items-center justify-center shadow-xl text-[#0B1F3A] border-2 border-white hover:shadow-2xl transition-shadow cursor-pointer"
      >
        {isOpen ? <X className="w-6 h-6 text-white" /> : <MessageSquare className="w-6 h-6 text-white" />}
      </motion.button>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="absolute bottom-18 right-0 w-[400px] max-w-[calc(100vw-2rem)] h-[550px] bg-navy bg-opacity-95 backdrop-blur-xl border border-gray-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white"
          >
            {/* Header */}
            <div className="bg-[#0B1F3A] border-b border-gray-800 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="/nivaran-logo.svg" alt="Nivaran Logo" className="w-8 h-8 bg-white rounded-full shadow-sm p-0.5" />
                <div>
                  <h3 className="font-bold text-sm text-saffron tracking-wide">AI Companion</h3>
                  <span className="text-[10px] text-green flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse"></span>
                    Online (Grounded RAG)
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Thread Container */}
            <div className="flex-grow overflow-y-auto p-6 space-y-4 scrollbar-thin">
              {messages.map((msg, index) => (
                <div 
                  key={index}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm relative overflow-hidden ${
                      msg.sender === 'user' 
                        ? 'bg-saffron text-navy font-semibold rounded-br-none' 
                        : 'bg-navy-light bg-opacity-50 border border-gray-800 rounded-bl-none'
                    }`}
                  >
                    {/* Message Text */}
                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    {/* Speech / TTS Button for AI messages */}
                    {msg.sender === 'ai' && (
                      <button
                        onClick={() => handleTTS(msg.text)}
                        className="mt-2 text-xs text-saffron hover:text-white flex items-center gap-1 transition-colors"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Speak response</span>
                      </button>
                    )}

                    {/* Agentic Action/Redirection Prompt Card */}
                    {msg.redirect && (
                      <div className="mt-3 p-3 bg-navy-dark border border-gray-700 rounded-xl flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-xs text-saffron">
                          <Shield className="w-3.5 h-3.5" />
                          <span className="font-bold uppercase tracking-wider">Action Detected</span>
                        </div>
                        <button
                          onClick={() => triggerRedirect(msg.redirect!, msg.suggestedFields)}
                          className="bg-green text-white py-2 px-3 rounded-lg text-xs font-bold hover:bg-green-600 transition-colors flex items-center justify-between"
                        >
                          <span>File Civic Complaint Now</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-navy-light bg-opacity-50 border border-gray-800 rounded-2xl rounded-bl-none p-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-saffron rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 bg-green rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Prompt Chips */}
            {messages.length === 1 && (
              <div className="px-6 py-2 flex flex-wrap gap-2 border-t border-gray-900 border-opacity-40">
                <button
                  onClick={() => handleSendMessage('Check PM-KISAN Eligibility')}
                  className="text-[11px] bg-navy-dark hover:bg-gray-800 text-saffron border border-gray-800 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                >
                  🌾 Check PM-KISAN
                </button>
                <button
                  onClick={() => handleSendMessage('What is Ayushman Bharat?')}
                  className="text-[11px] bg-navy-dark hover:bg-gray-800 text-green border border-gray-800 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                >
                  🏥 Ayushman Bharat Cover
                </button>
                <button
                  onClick={() => handleSendMessage('How to get house in PMAY?')}
                  className="text-[11px] bg-navy-dark hover:bg-gray-800 text-white border border-gray-800 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                >
                  🏠 Apply for PMAY Home
                </button>
              </div>
            )}

            {/* Input Bar */}
            <form 
              onSubmit={handleSubmit}
              className="p-4 bg-navy-dark border-t border-gray-800 flex items-center gap-2"
            >
              <button
                type="button"
                onClick={handleStartSTT}
                className={`p-3 rounded-xl transition-all cursor-pointer ${
                  recording 
                    ? 'bg-red-600 text-white animate-pulse' 
                    : 'bg-navy-light hover:bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                <Mic className="w-5 h-5" />
              </button>

              <input
                type="text"
                placeholder={recording ? "Listening..." : "Ask in Hindi, Tamil, English..."}
                value={input}
                disabled={recording || loading}
                onChange={(e) => setInput(e.target.value)}
                className="flex-grow bg-navy border border-gray-800 rounded-xl px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron"
              />

              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-3 bg-saffron text-navy rounded-xl hover:opacity-95 transition-opacity disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
