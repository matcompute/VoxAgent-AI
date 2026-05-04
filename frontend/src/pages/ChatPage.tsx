import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, ShieldCheck, CreditCard, Receipt, LifeBuoy } from 'lucide-react';
import api from '../api/client';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  status?: 'thinking' | 'acting' | 'done';
  action?: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am VoxAgent, your AI Customer Success Partner. How can I assist you with your banking or telecom services today?',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const chatHistory = messages.map(m => ({ role: m.role, content: m.content }));
      const res = await api.post('/chat', {
        message: input,
        history: chatHistory
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: res.data.content,
        timestamp: new Date(),
        status: 'done',
        action: res.data.actions.length > 0 ? `Executed: ${res.data.actions.map((a: any) => a.tool).join(', ')}` : undefined
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error while processing your request. Please try again.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '8px', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '12px' }}>
            <Bot color="var(--accent-primary)" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px' }}>VoxAgent</h2>
            <span style={{ fontSize: '12px', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)' }}></div>
              Agent Active (v2.5 Flash)
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <ShieldCheck size={20} color="var(--text-secondary)" />
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ padding: '12px 20px', display: 'flex', gap: '10px', overflowX: 'auto', borderBottom: '1px solid var(--border-color)' }}>
        <button className="btn btn-secondary" style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
          <CreditCard size={14} /> Check Balance
        </button>
        <button className="btn btn-secondary" style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
          <Receipt size={14} /> Billing Query
        </button>
        <button className="btn btn-secondary" style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
          <LifeBuoy size={14} /> Support Ticket
        </button>
      </div>

      {/* Chat Messages */}
      <div ref={scrollRef} style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {messages.map((m) => (
          <div key={m.id} style={{ display: 'flex', gap: '16px', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
            <div style={{ 
              width: '36px', height: '36px', borderRadius: '10px', 
              background: m.role === 'user' ? 'var(--bg-secondary)' : 'rgba(56, 189, 248, 0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              {m.role === 'user' ? <User size={20} /> : <Bot size={20} color="var(--accent-primary)" />}
            </div>
            <div style={{ maxWidth: '80%' }}>
              <div style={{ 
                padding: '12px 16px', borderRadius: '12px', 
                background: m.role === 'user' ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                color: m.role === 'user' ? 'white' : 'var(--text-primary)',
                lineHeight: '1.5'
              }}>
                {m.content}
                {m.action && (
                  <div style={{ 
                    marginTop: '12px', padding: '8px', background: 'rgba(0,0,0,0.2)', 
                    borderRadius: '8px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px',
                    color: 'var(--accent-primary)'
                  }}>
                    <div className="spinner" style={{ width: '12px', height: '12px', border: '2px solid var(--accent-primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    {m.action}
                  </div>
                )}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px', textAlign: m.role === 'user' ? 'right' : 'left' }}>
                {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div style={{ color: 'var(--text-secondary)', fontSize: '12px', marginLeft: '52px' }}>
            VoxAgent is thinking...
          </div>
        )}
      </div>

      {/* Input Area */}
      <div style={{ padding: '20px', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ position: 'relative' }}>
          <input 
            className="input-field"
            placeholder="Type your message here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            style={{ 
              position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
              background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--accent-primary)'
            }}
          >
            <Send size={20} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
