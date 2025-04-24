import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const dummyUsers = [
    { email: 'ashish.nair@drcode.ai', password: 'password123' },
    { email: 'karan.joshi@drcode.ai', password: 'pass456' },
    { email: 'user3@example.com', password: 'secure789' },
    { email: 'jane.doe@example.com', password: 'janepass' },
    { email: 'john.smith@example.com', password: 'johnpass' },
  ];

  const handleLogin = async () => {
    const userFound = dummyUsers.find(
      (user) => user.email === email && user.password === password
    );

    if (userFound) {
      setError('');

      // Handle threadId per user
      const threadMapRaw = localStorage.getItem('userThreadMap');
      const threadMap = threadMapRaw ? JSON.parse(threadMapRaw) : {};

      if (!threadMap[email]) {
        try {
          const response = await fetch('https://orion-ai-v1.onrender.com/thread');
          const data = await response.json();
          if (data?.threadId) {
            threadMap[email] = data.threadId;
            localStorage.setItem('userThreadMap', JSON.stringify(threadMap));
            localStorage.setItem(data.threadId, JSON.stringify([])); // Optional: initialize message history
          }
        } catch (err) {
          console.error('Failed to fetch threadId:', err);
        }
      }

      // Set the current session's threadId
      localStorage.setItem('currentThreadId', threadMap[email]);

      navigate('/chat');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.3 }}
      className="h-screen w-full flex justify-center items-center bg-gray-100"
    >
      <div className="w-[400px] bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-6">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">Welcome Back</h2>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            onClick={handleLogin}
            className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all"
          >
            Login
          </button>
        </div>

        {/* <p className="text-sm text-center text-gray-500">
          Don't have an account? <span className="text-blue-600 cursor-pointer hover:underline">Sign up</span>
        </p> */}
      </div>
    </motion.div>
  );
};

export default LoginPage;
