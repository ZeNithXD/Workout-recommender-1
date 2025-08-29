import React, { useState } from 'react';
import { 
  Box, 
  Fab, 
  Drawer, 
  Typography, 
  TextField, 
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress
} from '@mui/material';
import { 
  FitnessCenter as DumbbellIcon,
  Send as SendIcon,
  Close as CloseIcon
} from '@mui/icons-material';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! I'm your fitness assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage: Message = {
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Call the backend API
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputText }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      //Add bot response
      const botMessage: Message = {
        text: data.response,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      // Add error message
      const errorMessage: Message = {
        text: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="chat"
        onClick={() => setIsOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000,
          backgroundColor: '#1976d2',
          '&:hover': {
            backgroundColor: '#1565c0',
          },
        }}
      >
        <DumbbellIcon />
      </Fab>

      <Drawer
        anchor="right"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: 400,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div">
            Fitness Assistant
          </Typography>
          <IconButton onClick={() => setIsOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />

        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
          <List>
            {messages.map((message, index) => (
              <ListItem
                key={index}
                sx={{
                  justifyContent: message.isUser ? 'flex-end' : 'flex-start',
                }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    maxWidth: '80%',
                    backgroundColor: message.isUser ? '#1976d2' : '#f5f5f5',
                    color: message.isUser ? 'white' : 'black',
                    whiteSpace: 'pre-line',
                  }}
                >
                  <ListItemText primary={message.text} />
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    {message.timestamp.toLocaleTimeString()}
                  </Typography>
                </Paper>
              </ListItem>
            ))}
            {isLoading && (
              <ListItem sx={{ justifyContent: 'flex-start' }}>
                <CircularProgress size={20} />
              </ListItem>
            )}
          </List>
        </Box>

        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSend();
                }
              }}
              disabled={isLoading}
            />
            <IconButton 
              color="primary" 
              onClick={handleSend}
              disabled={!inputText.trim() || isLoading}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default ChatBot; 
