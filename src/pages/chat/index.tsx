import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Grid, Typography, Paper, Box } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import '../.././chat.css'; // Import your CSS file for styling

interface Message {
    text: string;
    isUser: boolean;
}

const buttonStyles = {
    backgroundColor: '#3d5441',
    color: 'white',
    padding: '8px 16px',
    width: '100px',
};



const Chat: React.FC = () => {
    const [inputText, setInputText] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        // Simulate a greeting from the chatbot when the component mounts
        addBotMessage("Hello! How can I assist you today?");
    }, []);

    const addBotMessage = (text: string) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { text, isUser: false },
        ]);
    };

    const handleUserInput = () => {
        if (inputText.trim() === '') return;

        // Add the user's message to the chat
        setMessages((prevMessages) => [
            ...prevMessages,
            { text: inputText, isUser: true },
        ]);

        // Check for specific questions or keywords and provide custom responses
        const response = getCustomResponse(inputText);

        // If no specific question or keyword matched, echo the user's input
        if (response === null) {
            addBotMessage(`You said: ${inputText}`);
        } else {
            addBotMessage(response);
        }

        // Clear the input field
        setInputText('');
    };

    const getCustomResponse = (userInput: string): string | null => {
        // Define custom responses based on specific questions or keywords
        // Define custom responses based on specific questions or keywords (case-insensitive)
        const responses: { [key: string]: string } = {
            'hi': 'hello, good soul, tell me how can I help you?',
            'hello': 'hi, good soul, tell me how can I help you?',
            "how are you": "I'm just a computer program, but thanks for asking!",
            "what's the weather today": "I'm sorry, I don't have access to real-time weather data.",
            "what's your name?": "I'm sorry, I don't have any name, I'm an online dictionary",
            "tell me a joke": "Why did the computer keep freezing? Because it left its Windows open!",
            "who created you": "I was created by a team of developers at OpenAI.",
            "what is the meaning of life": "The meaning of life is a philosophical question that has been debated for centuries. Some say it's 42.",
            "what can you do": "I can provide information, answer questions, tell jokes, and more. Feel free to ask me anything!",
            "goodbye": "Goodbye! If you have more questions in the future, don't hesitate to ask.",
            "thank you": "You're welcome! Feel free to ask if you need assistance with anything else.",
            "help": "I'm here to help. Please ask me any questions you have.",
            "how old are you": "I don't have an age, as I'm just a piece of software.",
            "bye": "It's sad to see you go but please come back soon.",
            // Add more custom responses as needed
        };

        // Check if userInput matches any of the defined questions or keywords
        for (const question in responses) {
            if (userInput.toLowerCase().includes(question.toLowerCase())) {
                return responses[question];
            }
        }

        // If no match is found, return null to echo the user's input
        return null;
    };

    return (
        <Container maxWidth="sm" className="chatbot">
            <Paper elevation={3} className="chatbot-paper">
                <Box p={2}>
                    <Typography variant="h6" gutterBottom>
                        Simple Chatbot
                    </Typography>
                    <div className="chatbot-messages">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`message ${message.isUser ? 'user' : 'bot'}`}
                            >
                                {message.text}
                            </div>
                        ))}
                    </div>
                    <div className="chatbot-input">
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={9}>
                                <TextField
                                    label="Type your message..."
                                    variant="outlined"
                                    fullWidth
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault(); // Prevent the default behavior of the Enter key (form submission)
                                            handleUserInput();
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    endIcon={<SendIcon />}
                                    fullWidth
                                    onClick={handleUserInput}
                                    style={buttonStyles}
                                >
                                    Send
                                </Button>
                            </Grid>
                        </Grid>
                    </div>
                </Box>
            </Paper>
        </Container>
    );
};

export default Chat;
