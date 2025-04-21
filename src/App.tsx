import { useState, useRef, useEffect } from 'react';
import MarkdownPreview from "@uiw/react-markdown-preview";
import './App.css';

interface Message {
  text: string;
  sender: "user" | "bot";
  time?: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
  if (newMessage.trim() === '') return;

  const time = new Date().toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const userMessage: Message = { text: newMessage, sender: 'user', time };
  setMessages((prev) => [...prev, userMessage]);
  setNewMessage('');
  setIsTyping(true);

  try {
    const response = await fetch('https://orion-ai-v1.onrender.com/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: newMessage }),
    });

    const data = await response.json();

    const botMessage: Message = {
      text: data.message || '😓 No response from AI.',
      sender: 'bot',
      time,
    };

    setMessages((prev) => [...prev, botMessage]);
  } catch (error) {
    console.error('Error:', error);
    setMessages((prev) => [
      ...prev,
      {
        text: '😓 Oops! Something went wrong while fetching the response. Please try again.',
        sender: 'bot',
        time,
      },
    ]);
  } finally {
    setIsTyping(false);
  }
};




  
  // const updateBotMessage = (newText: string) => {
  //   setMessages((prev) => {
  //     const updated = [...prev];
  //     updated[updated.length - 1] = {
  //       ...updated[updated.length - 1],
  //       text: newText,
  //     };
  //     return updated;
  //   });
  // };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className='px-24 pt-10'>
      <div className='text-[24px] font-bold'>ORION AI</div>
      <div className="pt-4 pb-4 border-2 border-grey rounded-3xl h-screen flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`mb-4 flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center mb-1 gap-2">
                {msg.sender === 'user' ? (
                  <>
                    <span className="text-sm mr-2 text-gray-600 font-medium">You</span>
                    <img src="https://www.gravatar.com/avatar/?d=mp&f=y" alt="Default avatar" className="w-8 h-8 border-4 border-[#1480b7] rounded-full" />
                  </>
                ) : (
                  <>
                    <img src="https://mindler-products-images.imgix.net/confluence/all-services/orion-ai-logo.svg" alt="bot" className="w-8 h-8 border-4 border-[#1480b7] rounded-full" />
                    <span className="text-sm text-gray-600 font-medium">ORION AI</span>
                  </>
                )}
              </div>

              <div
                className={`p-3 max-w-[95%] text-[18px] whitespace-pre-wrap break-words ${msg.sender === 'user'
                  ? 'rounded-xl bg-[#1480b7] text-white rounded-tr-none'
                  : 'text-black'
                  }`}>
                {msg.sender === 'bot' ? (
                  <MarkdownPreview
                  source={msg.text}
                  className="custom-markdown"
                  // style={{
                  //   whiteSpace: 'pre-wrap',
                  //   wordBreak: 'break-word',
                  //   fontSize: 16,
                  // }}
                />

                ) : (
                  <div>{msg.text}</div>
                )}
              </div>

              <div className="text-xs text-gray-500 mt-1">
                {msg.time || 'Just now'}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="mb-4 flex flex-col items-start">
              <div className="flex items-center mb-1 gap-2">
                <img
                  src="https://mindler-products-images.imgix.net/confluence/all-services/orion-ai-logo.svg"
                  alt="bot"
                  className="w-8 h-8 border-4 border-[#1480b7] rounded-full"
                />
                <span className="text-sm text-gray-600 font-medium">ORION AI</span>
              </div>
              <div className="flex space-x-1 px-3 py-2 bg-[#e1f1fb] rounded-xl w-fit">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.1s]"></span>
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.3s]"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="sticky bottom-0 bg-white border-gray-300">
          <div className="relative px-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your career question here"
              className="w-full border border-gray-300 rounded-full p-3 pr-16 focus:outline-none focus:ring-0 focus:border-gray-300"
            />
            <button
              onClick={handleSend}
              className="absolute right-5 top-1/2 transform -translate-y-1/2 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-5 h-5"
                style={{ fill: '#1480b7' }}
              >
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>

            </button>

          </div>
        </div>
        <div className="flex items-center p-2 justify-between">
          <button className="bg-[#1480b7] rounded-md p-2 text-white shrink-0">
            Contact us for help
          </button>
          <p className="text-center w-full ml-4">
            Orion AI can make mistakes. Check important info.
          </p>
        </div>

      </div>
    </div>
  );
}

export default App;