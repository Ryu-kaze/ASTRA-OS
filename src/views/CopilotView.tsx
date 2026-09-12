import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { Bot, Send, User, Sparkles, Terminal, RefreshCw } from 'lucide-react';

export const CopilotView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'copilot',
      text: 'Greetings Commander. ASTRA OS AI Mission Copilot online. Telemetry feeds for 1,248 satellites and 500 space debris objects are operational. How can I assist your mission control operations?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' UTC',
      suggestedActions: [
        'Check CARTOSAT-3 Collision Risk',
        'Summarize Space Weather Alert',
        'Recommend Avoidance Maneuver',
      ],
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const prompt = textToSend || input;
    if (!prompt.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' UTC',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt, chatHistory: messages }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP status ${res.status}`);
      }

      const data = await res.json();

      const copilotReply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'copilot',
        text: data.text || data.error || 'ASTRA OS Copilot response logged. Telemetry sync active.',
        timestamp: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' UTC',
        suggestedActions: data.suggestedActions || [],
      };

      setMessages((prev) => [...prev, copilotReply]);
    } catch (err: any) {
      console.error('Copilot Chat Error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          sender: 'copilot',
          text: `ASTRA OS Copilot Standby Mode: ${err?.message || 'Telemetry connection issue'}. All orbital sensors remaining active.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' UTC',
          suggestedActions: ['Check CARTOSAT-3 Collision Risk', 'Summarize Space Weather Alert'],
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white font-mono flex items-center gap-2">
            <Bot className="w-6 h-6 text-purple-400" /> MODULE 7: AI MISSION COPILOT
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            AUTONOMOUS SPACE OPERATIONS ASSISTANT POWERED BY GEMINI AI & TELEMETRY KNOWLEDGE BASE
          </p>
        </div>
      </div>

      {/* Chat Terminal Box */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl backdrop-blur-xl flex flex-col h-[600px] overflow-hidden shadow-2xl">
        {/* Chat History Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 font-mono text-xs custom-scrollbar">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'copilot' && (
                <div className="w-8 h-8 rounded-xl bg-purple-950 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-xl p-4 rounded-2xl space-y-2 ${
                  msg.sender === 'user'
                    ? 'bg-cyan-950/80 border border-cyan-500/40 text-cyan-100 rounded-tr-none'
                    : 'bg-slate-950/90 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800/80 pb-1">
                  <span className="font-bold uppercase tracking-wider">
                    {msg.sender === 'user' ? 'OPERATOR COMMAND' : 'ASTRA AI COPILOT'}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>

                <p className="leading-relaxed font-sans text-xs whitespace-pre-wrap">{msg.text}</p>

                {/* Quick Suggestion Chips */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-2">
                    {msg.suggestedActions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(action)}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 text-[10px] text-cyan-300 font-mono transition"
                      >
                        ⚡ {action}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center space-x-2 text-purple-400 text-xs font-mono p-2">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>ASTRA OS AI COPILOT ANALYZING TELEMETRY...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Chat Input Bar */}
        <div className="p-4 bg-slate-950/90 border-t border-slate-800/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Copilot: 'What is the conjunction risk for CARTOSAT-3?' or 'Recommend avoidance burn'..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-slate-950 font-extrabold uppercase text-xs flex items-center space-x-2 transition disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">TRANSMIT</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
