import React, { useEffect, useRef, useState } from 'react';
import './chatbot.css';
import Icon from '../../assets/icon.png';
import MarkdownPreview from "@uiw/react-markdown-preview";


interface Message {
    text: string;
    sender: "user" | "bot";
    time?: string;
}

const Chatbot: React.FC = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);




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

            console.log(botMessage)

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
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSend();
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    return (
        <div className='h-[95vh] w-[500px] rounded-[20px] overflow-hidden flex flex-col justify-between items-center' style={{ boxShadow: "3px 3px 25px #808080" }}>

            {/* Header */}
            <div className='basis-[15%] header w-full flex items-center gap-[10px] pl-[30px] bg-gradient-to-r from-[#3f89ff] to-[#62b4ff]'>
                <div className='w-[65px] h-[65px] rounded-full bg-white bg-center bg-cover' style={{ backgroundImage: `url("${Icon}")` }}></div>
                <div>
                    <h4 className='text-sm text-white'>Chat with</h4>
                    <h2 className='text-xl font-bold text-white'>Orion AI</h2>
                </div>
            </div>

            {/* Chat Body */}
            <div className='basis-[70%] w-full overflow-y-auto overflow-x-hidden p-4 bg-white scroll-div'>
                <div className=' bg-[red] h-[100px] w-[500px] z-[9] top-[-60px] right-[16px] pr-[50px] relative waves flex justify-end items-center'>
                    <p className='text-white text-[18px] mt-[5px] font-[500]'>Your Career assistant</p>
                </div>
                {messages.map((msg, idx) => (
                    <div key={idx} className={`mb-4 flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-center mb-1 gap-2">
                            {msg.sender === 'user' ? (
                                <>
                                    <span className="text-sm text-gray-600 font-medium">You</span>
                                    <img src="https://www.gravatar.com/avatar/?d=mp&f=y" alt="User avatar" className="w-8 h-8 border-4 border-[#1480b7] rounded-full" />
                                </>
                            ) : (
                                <>
                                    <img src="https://mindler-products-images.imgix.net/confluence/all-services/orion-ai-logo.svg" alt="Bot" className="w-8 h-8 border-4 border-[#1480b7] rounded-full" />
                                    <span className="text-sm text-gray-600 font-medium">ORION AI</span>
                                </>
                            )}
                        </div>

                        <div className={` max-w-[85%] text-[16px] whitespace-pre-wrap break-words shadow-lg ${msg.sender === 'user'
                            ? 'rounded-xl bg-[#1480b7] text-white rounded-tr-none p-3'
                            : 'text-black rounded-xl p-[1.3rem]'}`}>
                            {msg.sender === 'bot' ? (

                                // <div>{msg.text}</div>
                                <MarkdownPreview
                                    source={msg.text}
                                    className="markdown-preview text-black"
                                    style={{ background: 'transparent', padding: 0 }}
                                />

                            ) : (
                                <div>{msg.text}</div>
                            )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{msg.time}</div>
                    </div>
                ))}

                {/* Typing Animation */}
                {isTyping && (
                    <div className="mb-4 flex flex-col items-start">
                        <div className="flex items-center mb-1 gap-2">
                            <img src="https://mindler-products-images.imgix.net/confluence/all-services/orion-ai-logo.svg" alt="Bot" className="w-8 h-8 border-4 border-[#1480b7] rounded-full" />
                            <span className="text-sm text-gray-600 font-medium">ORION AI</span>
                        </div>
                        <div className="flex space-x-1 px-3 py-2 bg-white rounded-xl w-fit">
                            <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.1s]" />
                            <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                            <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.3s]" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Section */}
            <div className="basis-[15%] header w-full flex flex-col justify-center px-4 py-2">
                <div className="relative w-full">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your career question here"
                        className="w-full border border-gray-300 rounded-[12px] p-3 pr-16 focus:outline-none"
                    />
                    <button
                        onClick={handleSend}
                        className="absolute right-5 top-1/2 transform -translate-y-1/2 flex items-center justify-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" style={{ fill: '#1480b7' }}>
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                        </svg>
                    </button>
                </div>
                <div className="flex items-center justify-center mt-2">
                    {/* <button className="bg-[#1480b7] rounded-md px-3 py-2 text-white text-sm">Contact us for help</button> */}
                    <p className="text-xs text-white ml-2 text-center w-full">Orion AI can make mistakes. Check important info.</p>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
