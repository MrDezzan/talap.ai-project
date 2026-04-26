import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('talap_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  const [aiProfile, setAiProfile] = useState(() => {
    try {
      const stored = localStorage.getItem('talap_ai_profile');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const fetchMe = async () => {
    try {
      const data = await api.get('/api/me');
      setUser(data);
      localStorage.setItem('talap_user', JSON.stringify(data));
    } catch (err) {
      console.error('Failed to fetch user data:', err);
    }
  };

  const fetchAIProfile = async () => {
    try {
      const data = await api.get('/api/portfolio');
      if (data && data.ai_result) {
        let parsed = data.ai_result;
        if (typeof parsed === 'string') parsed = JSON.parse(parsed);
        setAiProfile(parsed);
        localStorage.setItem('talap_ai_profile', JSON.stringify(parsed));
      }
    } catch (err) {
      console.error('Failed to fetch AI profile:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMe();
      fetchAIProfile();
    }
  }, []); // Only on initial mount if user exists

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await api.post('/api/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('talap_user', JSON.stringify(data.user));
      setUser(data.user);
      return data;
    } catch (err) {
      return { error: err.message, status: err.status };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, grade, city) => {
    try {
      return await api.post('/api/register', { name, email, password, grade, city });
    } catch (err) {
      return { error: err.message, status: err.status };
    }
  };

  const analyzeProfile = async (profileData) => {
    try {
      const data = await api.post('/api/ai/analyze', profileData || {});
      setAiProfile(data);
      localStorage.setItem('talap_ai_profile', JSON.stringify(data));
      return data;
    } catch (err) {
      return { error: err.message, status: err.status };
    }
  };

  const updateUser = async (userData) => {
    try {
      const data = await api.put('/api/me', userData);
      setUser(data);
      localStorage.setItem('talap_user', JSON.stringify(data));
      // Trigger AI re-analysis after profile update
      await analyzeProfile();
      return data;
    } catch (err) {
      return { error: err.message };
    }
  };

  const logout = () => {
    setUser(null);
    setAiProfile(null);
    localStorage.removeItem('token');
    localStorage.removeItem('talap_user');
    localStorage.removeItem('talap_ai_profile');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, analyzeProfile, updateUser, logout, loading, aiProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
