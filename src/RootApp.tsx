import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { AuthProvider } from './app/context/AuthContext';
import AdminRoute from './app/components/AdminRoute';
import App from './app/App';
import AdminFeedbackPage from './app/pages/AdminFeedbackPage';
import ContactPage from './app/pages/ContactPage';
import LoginPage from './app/pages/LoginPage';
import RegisterPage from './app/pages/RegisterPage';
import ChatPage from './app/pages/ChatPage';

export default function RootApp() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/lien-he" element={<ContactPage />} />
          <Route path="/feedback" element={<Navigate to="/#feedback" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminFeedbackPage />
              </AdminRoute>
            }
          />
          <Route path="/admin/feedback" element={<Navigate to="/admin" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
