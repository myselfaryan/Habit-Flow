import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Habits from './pages/Habits';
import Tasks from './pages/Tasks';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import AuthGuard from './components/auth/AuthGuard';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <Router>
            <Routes>
              {/* Redirect root to app */}
              <Route path="/" element={<Navigate to="/app" replace />} />
              
              <Route path="/app" element={
                <AuthGuard>
                  <Layout />
                </AuthGuard>
              }>
                <Route index element={<Dashboard />} />
                <Route path="habits" element={<Habits />} />
                <Route path="tasks" element={<Tasks />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              
              {/* Catch all route - redirect to app */}
              <Route path="*" element={<Navigate to="/app" replace />} />
            </Routes>
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--toast-bg)',
                  color: 'var(--toast-color)',
                  border: '1px solid var(--toast-border)',
                },
              }}
            />
          </Router>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;