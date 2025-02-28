import React, { useState, useRef, useEffect } from 'react';
import { Layout } from '../components/layout';
import {
    Box,
    Paper,
    TextField,
    IconButton,
    Typography,
    Grid,
    Avatar,
    CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';

interface Message {
    id: string;
    content: string;
    sender: 'user' | 'assistant';
    timestamp: Date;
}

export const CustomerService: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            content: '你好！我是AI客服助手，很高兴为您服务。请问有什么可以帮您？',
            sender: 'assistant',
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            content: input,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/cs/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: input,
                }),
            });

            const data = await response.json();

            if (data.success) {
                const assistantMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    content: data.data.response,
                    sender: 'assistant',
                    timestamp: new Date(),
                };
                setMessages(prev => [...prev, assistantMessage]);
            } else {
                // 处理错误响应
                const errorMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    content: '抱歉，我遇到了一些问题，请稍后再试。',
                    sender: 'assistant',
                    timestamp: new Date(),
                };
                setMessages(prev => [...prev, errorMessage]);
            }
        } catch (error) {
            // 处理网络错误
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: '网络连接出现问题，请检查您的网络连接后重试。',
                sender: 'assistant',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout>
            <ChatContainer>
                <ChatHeader>
                    <Typography variant="h6">
                        智能客服助手
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        24/7全天候为您服务
                    </Typography>
                </ChatHeader>

                <MessagesContainer>
                    {messages.map((message) => (
                        <MessageWrapper
                            key={message.id}
                            $isUser={message.sender === 'user'}
                        >
                            <Avatar
                                sx={{
                                    bgcolor: message.sender === 'user' ? 'primary.main' : 'secondary.main',
                                    width: 32,
                                    height: 32,
                                }}
                            >
                                {message.sender === 'user' ? <PersonIcon /> : <SmartToyIcon />}
                            </Avatar>
                            <MessageBubble $isUser={message.sender === 'user'}>
                                <Typography variant="body1">
                                    {message.content}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                    {message.timestamp.toLocaleTimeString()}
                                </Typography>
                            </MessageBubble>
                        </MessageWrapper>
                    ))}
                    {isLoading && (
                        <MessageWrapper $isUser={false}>
                            <Avatar
                                sx={{
                                    bgcolor: 'secondary.main',
                                    width: 32,
                                    height: 32,
                                }}
                            >
                                <SmartToyIcon />
                            </Avatar>
                            <LoadingBubble>
                                <CircularProgress size={20} />
                            </LoadingBubble>
                        </MessageWrapper>
                    )}
                    <div ref={messagesEndRef} />
                </MessagesContainer>

                <InputContainer>
                    <TextField
                        fullWidth
                        placeholder="请输入您的问题..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        disabled={isLoading}
                        multiline
                        maxRows={4}
                        variant="outlined"
                    />
                    <SendButton
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        color="primary"
                    >
                        <SendIcon />
                    </SendButton>
                </InputContainer>
            </ChatContainer>
        </Layout>
    );
};

const ChatContainer = styled(Paper)({
    margin: '1rem auto',
    maxWidth: '800px',
    minHeight: '600px',
    height: '85vh',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '12px',
    overflow: 'hidden',
    position: 'sticky',
    top: '1rem',
});

const ChatHeader = styled(Box)({
    padding: '1rem',
    borderBottom: '1px solid #e0e0e0',
    backgroundColor: '#fff',
});

const MessagesContainer = styled(Box)({
    flex: 1,
    padding: '1rem',
    overflowY: 'auto',
    backgroundColor: '#f5f5f5',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    '&::-webkit-scrollbar': {
        width: '6px',
    },
    '&::-webkit-scrollbar-track': {
        background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
        background: '#ddd',
        borderRadius: '3px',
        '&:hover': {
            background: '#ccc',
        },
    },
});

const MessageWrapper = styled(Box)<{ $isUser: boolean }>(({ $isUser }) => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.5rem',
    flexDirection: $isUser ? 'row-reverse' : 'row',
}));

const MessageBubble = styled(Box)<{ $isUser: boolean }>(({ $isUser, theme }) => ({
    backgroundColor: $isUser ? theme.palette.primary.main : '#fff',
    color: $isUser ? '#fff' : theme.palette.text.primary,
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    maxWidth: '70%',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    '& .MuiTypography-caption': {
        display: 'block',
        textAlign: 'right',
        marginTop: '0.25rem',
        color: $isUser ? 'rgba(255,255,255,0.7)' : theme.palette.text.secondary,
    },
}));

const LoadingBubble = styled(Box)({
    backgroundColor: '#fff',
    padding: '1rem',
    borderRadius: '12px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
});

const InputContainer = styled(Box)({
    padding: '1rem',
    borderTop: '1px solid #e0e0e0',
    backgroundColor: '#fff',
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-end',
});

const SendButton = styled(IconButton)({
    padding: '0.5rem',
});

export { }; 