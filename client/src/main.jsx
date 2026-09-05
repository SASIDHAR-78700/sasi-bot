import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 3000,
                style: {
                  background: 'var(--card-strong)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '12px',
                  boxShadow: '0 4px 24px var(--scrim)',
                  color: 'var(--text)',
                  fontSize: '14px',
                  padding: '12px 16px',
                },
                success: {
                  iconTheme: {
                    primary: 'var(--accent)',
                    secondary: '#FFFFFF',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#F43F5E',
                    secondary: '#FFFFFF',
                  },
                },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
  </React.StrictMode>
);
