import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import { LanguageProvider } from './context/LanguageContext';

import AppLayout from './layouts/AppLayout';
import AuthLayout from './layouts/AuthLayout';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import NotFound from './pages/NotFound';

import Dashboard from './screens/Dashboard';
import Catalog from './screens/Catalog';
import Roadmap from './screens/Roadmap';
import Chat from './screens/Chat';
import Grants from './screens/Grants';
import Portfolio from './screens/Portfolio';
import Profile from './screens/Profile';
import Quiz from './screens/Quiz';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ChatProvider>
          <BrowserRouter>
          <ScrollToTop />
          <Routes>
            
            <Route path="/" element={<Landing />} />

            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Route>

            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/professions" element={<Catalog />} />
              <Route path="/grants" element={<Grants />} />
              <Route path="/roadmap" element={<Roadmap />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/settings" element={<Profile />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </ChatProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
