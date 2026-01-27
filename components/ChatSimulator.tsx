
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Paperclip, Loader2, Check } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { Message } from '../types';

interface ChatSimulatorProps {
  onStepChange: (step: string) => void;
}

export const ChatSimulator: React.FC<ChatSimulatorProps> = ({ onStepChange }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'bot',
      text: "Вітаю! Я — медичний координатор сервісу медичного туризму в Ізраїлі. Я допоможу вам зібрати необхідні документи для наших лікарів.\n\nПерш за все, оберіть мову спілкування (RU/EN/UA).",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          { role: 'user', parts: [{ text: `
            CONTEXT: You are a medical coordinator for Israel Medical Tourism.
            GOAL: Collect anamnesis and documents.
            CONSTRAINTS: You are NOT a doctor. No advice. Be polite. Keep conversation on track.
            USER INPUT: ${input}
            CURRENT HISTORY: ${messages.map(m => `${m.role}: ${m.text}`).join('\n')}
            
            Respond in the language the user is speaking. 
            If they chose a language, confirm and move to 'Consent & Basic Info' (Phase A).
            Always steer back to: 1. Full Name, 2. Phone, 3. Goal (Diagnostic/Treatment).
          ` }] }
        ],
        config: {
          systemInstruction: "You are a professional Israeli medical coordinator. Your name is MedCoord AI. You must not diagnose. You must be precise. Always return to data collection."
        }
      });

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        text: response.text || "Вибачте, сталася помилка. Спробуйте ще раз.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
      
      // Heuristic step logic for dashboard visuals
      if (messages.length > 8) onStepChange('D');
      else if (messages.length > 5) onStepChange('C');
      else if (messages.length > 2) onStepChange('B');

    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Chat Header */}
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
              AI
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h3 className="font-bold text-slate-800">MedCoord Coordinator</h3>
            <p className="text-xs text-green-600 font-medium">Online & Ready</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
      >
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${m.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>
                {m.role === 'user' ? <User size={16}/> : <Bot size={16}/>}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                m.role === 'user' 
                  ? 'bg-indigo-600 text-white shadow-md rounded-tr-none' 
                  : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
              }`}>
                {m.text}
                <div className={`text-[10px] mt-2 opacity-60 text-right`}>
                  {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="flex gap-3 items-center bg-slate-100 p-3 rounded-2xl rounded-tl-none border border-slate-200 text-slate-500 italic text-sm">
               <Loader2 size={16} className="animate-spin" />
               Координатор друкує...
             </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-200">
        <div className="flex items-center gap-2 max-w-4xl mx-auto">
          <button className="p-3 text-slate-400 hover:text-indigo-600 transition-colors">
            <Paperclip size={20} />
          </button>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Напишіть ваше повідомлення..."
            className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white p-3 rounded-xl transition-all shadow-md active:scale-95"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
