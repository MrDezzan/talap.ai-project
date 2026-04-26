import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [threads, setThreads] = useState([]);
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [messages, setMessages] = useState({}); // { threadId: [messages] }
  const [typing, setTyping] = useState({}); // { threadId: boolean }
  const [inputs, setInputs] = useState({}); // { threadId: string }
  const [loading, setLoading] = useState(false);

  const fetchThreads = async () => {
    try {
      const data = await api.get('/chats');
      setThreads(data || []);
    } catch (err) {
      console.error('Failed to fetch threads:', err);
    }
  };

  const fetchMessages = async (threadId) => {
    if (messages[threadId]) return; // Already loaded
    try {
      const data = await api.get(`/chats/${threadId}/messages`);
      setMessages(prev => ({ ...prev, [threadId]: (data || []).map(m => ({
        ai: m.role === 'assistant',
        text: m.content,
        roadmap: m.roadmap,
        cv_data: m.cv_data
      })) }));
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  const addMessage = (threadId, message) => {
    setMessages(prev => ({
      ...prev,
      [threadId]: [...(prev[threadId] || []), message]
    }));
  };

  return (
    <ChatContext.Provider value={{ 
      threads, 
      activeThreadId, 
      setActiveThreadId, 
      messages, 
      setMessages,
      typing,
      setTyping,
      inputs,
      setInputs,
      addMessage,
      fetchThreads, 
      fetchMessages,
      loading,
      setLoading
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within a ChatProvider');
  return context;
}
