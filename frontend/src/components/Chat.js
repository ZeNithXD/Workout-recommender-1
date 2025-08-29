import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './Chat.css';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Add user message
        const userMessage = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            //Send message to backend
            const response = await axios.post('http://localhost:8000/api/chat', {
                message: input
            });

            // Add AI response
            const aiMessage = { text: response.data.response, sender: 'ai' };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Error:', error);
            // Add error message
            const errorMessage = { 
                text: "Sorry, I'm having trouble connecting. Please try again.", 
                sender: 'ai' 
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-messages">
                {messages.map((message, index) => (
                    <div 
                        key={index} 
                        className={`message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
                    >
                        {message.text}
                    </div>
                ))}
                {isLoading && (
                    <div className="message ai-message loading">
                        <div className="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit} className="chat-input-form">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about fitness, workouts, or nutrition..."
                    className="chat-input"
                />
                <button 
                    type="submit" 
                    className="send-button"
                    disabled={isLoading}
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default Chat; 
