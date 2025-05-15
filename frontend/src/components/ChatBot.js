import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Fab, Drawer, IconButton, Box, Typography, TextField, CircularProgress } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import './Chat.css';

const ChatBot = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi! I'm your fitness assistant. Ask me anything about workouts, nutrition, or motivation!", sender: 'ai' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, open]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMessage = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        try {
            const response = await axios.post('http://localhost:8000/api/chat', { message: userMessage.text });
            const aiMessage = { text: response.data.response, sender: 'ai' };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting. Please try again.", sender: 'ai' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <>
            <Fab 
                color="primary" 
                aria-label="chatbot" 
                onClick={() => setOpen(true)}
                sx={{
                    position: 'fixed',
                    bottom: 20,
                    right: 20,
                    zIndex: 1200
                }}
            >
                <ChatIcon />
            </Fab>
            <Drawer
                anchor="right"
                open={open}
                onClose={() => setOpen(false)}
                PaperProps={{
                    sx: { width: 350, maxWidth: '100vw', display: 'flex', flexDirection: 'column', height: '100%' }
                }}
            >
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #eee' }}>
                    <Typography variant="h6">Fitness Assistant</Typography>
                    <IconButton onClick={() => setOpen(false)}><CloseIcon /></IconButton>
                </Box>
                <Box sx={{ flex: 1, overflowY: 'auto', p: 2, background: '#f5f5f5' }}>
                    {messages.map((msg, idx) => (
                        <Box
                            key={idx}
                            sx={{
                                mb: 1.5,
                                display: 'flex',
                                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                            }}
                        >
                            <Box
                                className={msg.sender === 'user' ? 'user-message' : 'ai-message'}
                                sx={{
                                    maxWidth: '80%',
                                    p: 1.5,
                                    borderRadius: 2,
                                    bgcolor: msg.sender === 'user' ? '#2196f3' : 'white',
                                    color: msg.sender === 'user' ? 'white' : '#333',
                                    boxShadow: msg.sender === 'ai' ? 1 : 0
                                }}
                            >
                                {msg.text}
                            </Box>
                        </Box>
                    ))}
                    {isLoading && (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', mb: 1.5 }}>
                            <CircularProgress size={20} />
                        </Box>
                    )}
                    <div ref={messagesEndRef} />
                </Box>
                <Box sx={{ p: 2, borderTop: '1px solid #eee', display: 'flex', gap: 1 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Ask about fitness, workouts, or nutrition..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading}
                        size="small"
                    />
                    <button
                        className="send-button"
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        style={{ minWidth: 60 }}
                    >
                        Send
                    </button>
                </Box>
            </Drawer>
        </>
    );
};

export default ChatBot; 