import React, { useState } from 'react';
import { Button, Modal, TextField, Stack, Typography } from '@mui/material';

const Chatbot = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleOpen = () => setChatOpen(true);
  const handleClose = () => setChatOpen(false);
  const handleSend = async () => {
    const newMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);
    setInput('');

    // Call API here
    const response = await fetch('/api/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input, pantryItems: ['item1', 'item2'], timeOfDay: 'lunch' })
    });
    const data = await response.json();
    setMessages([...newMessages, { sender: 'bot', text: data.reply }]);
  };

  return (
    <div>
      <Button variant="contained" onClick={handleOpen}>Chat with Bot</Button>
      <Modal open={chatOpen} onClose={handleClose}>
        <Stack spacing={2} sx={{ padding: 2, width: 400, bgcolor: 'white' }}>
          <Typography variant="h6">Chatbot</Typography>
          <div>
            {messages.map((msg, index) => (
              <Typography key={index} align={msg.sender === 'bot' ? 'left' : 'right'}>
                {msg.text}
              </Typography>
            ))}
          </div>
          <TextField
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button variant="contained" onClick={handleSend}>Send</Button>
        </Stack>
      </Modal>
    </div>
  );
};

export default Chatbot;
