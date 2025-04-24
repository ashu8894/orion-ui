import { useState, useRef, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Chatbot from './components/chatbot/Chatbot';
import LoginPage from './components/login/LoginPage';
import ProtectedRoute from './ProtectedRoute'; // Import the ProtectedRoute component

import './App.css';

function App() {
  return (
    <AnimatePresence mode="wait">
      <BrowserRouter>
        <Routes>
          <Route path={`/`} element={<LoginPage />} />
          <Route
            path={`/chat`}
            element={
              <ProtectedRoute>
                <Chatbot />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AnimatePresence>
  );
}

export default App;
