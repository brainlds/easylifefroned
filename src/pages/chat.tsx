import React, { useState, useRef, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
    Paper, TextField, IconButton, Typography, Box, Button,
    Menu, MenuItem, ListItemIcon, ListItemText, LinearProgress as MuiLinearProgress,
    Drawer as MuiDrawer
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import ShareIcon from '@mui/icons-material/Share';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import ImageIcon from '@mui/icons-material/Image';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import AppsIcon from '@mui/icons-material/Apps';
import FaceIcon from '@mui/icons-material/Face';
import ExploreIcon from '@mui/icons-material/Explore';
import SettingsIcon from '@mui/icons-material/Settings';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Message, Model, MODEL_PROVIDER_MAP } from '../types';
import MessageBubble from '../components/MessageBubble';

/**
 * 可用的模型列表
 */
const models: Model[] = [
    { id: 'deepseek', name: 'Deepseek', icon: '🧠' },
    { id: 'qianwen', name: '通义千问', icon: '🌐' },
];

const StyledLinearProgress = styled(MuiLinearProgress)({
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '2px',
});

const PageContainer = styled('div')({
    display: 'flex',
    height: '100vh',
    backgroundColor: '#fff',
    overflow: 'hidden',
    borderRadius: '16px',
});

const MainContent = styled('div')({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 240,
    position: 'relative',
    overflow: 'hidden',
    padding: '1rem 0',
});

const SidebarContent = styled('div')({
    padding: '1.5rem',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderRight: '1px solid #e0e0e0',
    borderTopLeftRadius: '16px',
    borderBottomLeftRadius: '16px',
});

const Logo = styled('div')({
    marginBottom: '2rem',
});

const NavButtons = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
});

const NavButton = styled(Button)({
    justifyContent: 'flex-start',
    textTransform: 'none',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    color: '#666',
    '&:hover': {
        backgroundColor: '#f5f5f5',
        color: '#333',
    },
});

const ChatHeader = styled('div')({
    padding: '0.75rem 1.25rem',
    borderBottom: '1px solid #e0e0e0',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    backgroundColor: '#fff',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    borderRadius: '16px',
    margin: '0 1rem',
});

const HeaderActions = styled('div')({
    marginLeft: 'auto',
    display: 'flex',
    gap: '0.5rem',
});

const MessagesContainer = styled(Box)({
    flex: 1,
    padding: '1.5rem',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    backgroundColor: '#f7f7f8',
    borderRadius: '24px',
    margin: '1rem',
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

const InputContainer = styled('div')({
    padding: '0.75rem 1.25rem',
    borderTop: '1px solid #e0e0e0',
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'flex-end',
    backgroundColor: '#fff',
    boxShadow: '0 -1px 2px rgba(0, 0, 0, 0.05)',
    borderRadius: '16px',
    margin: '0 1rem',
});

const ActionButtons = styled('div')({
    display: 'flex',
    gap: '0.5rem',
    '& .MuiIconButton-root': {
        color: '#666',
        padding: '8px',
        '&:hover': {
            backgroundColor: '#f5f5f5',
        },
    },
});

const StyledTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
        '&:hover': {
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        },
        '&.Mui-focused': {
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
        },
    },
    '& .MuiOutlinedInput-input': {
        padding: '8px 12px',
        fontSize: '0.92rem',
        lineHeight: 1.2,
    },
    '& .MuiOutlinedInput-notchedOutline': {
        border: '1px solid #e0e0e0',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#d0d0d0',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#bdbdbd',
    },
});

const SendButton = styled(IconButton)(({ theme }) => ({
    padding: '12px',
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    borderRadius: '12px',
    '&:hover': {
        backgroundColor: theme.palette.primary.dark,
    },
    '&:disabled': {
        backgroundColor: theme.palette.grey[300],
        color: theme.palette.grey[500],
    },
}));

const InputHint = styled(Typography)({
    padding: '0.5rem 1.5rem',
    color: '#888',
    fontSize: '0.75rem',
    textAlign: 'center',
    backgroundColor: '#fff',
});

const ModelSelector = styled(Button)({
    width: '100%',
    padding: '1rem',
    marginBottom: '1.5rem',
    justifyContent: 'flex-start',
    textTransform: 'none',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    border: '1px solid #e0e0e0',
    '&:hover': {
        backgroundColor: '#f0f0f0',
        border: '1px solid #d0d0d0',
    },
});

const ModelIcon = styled('span')({
    fontSize: '1.5rem',
    marginRight: '0.5rem',
});

const ModelInfo = styled('div')({
    flex: 1,
    textAlign: 'left',
});

const Bubble = styled(Box)(({ theme, role }: { theme?: any; role: string }) => ({
    display: 'inline-block',
    padding: theme.spacing(0.5, 1),
    borderRadius: '10px',
    maxWidth: '85%',
    backgroundColor: role === 'user'
        ? 'rgba(135, 206, 250, 0.9)'
        : '#fff',
    color: role === 'user'
        ? '#333'
        : theme.palette.text.primary,
    alignSelf: role === 'user' ? 'flex-end' : 'flex-start',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    '& pre': {
        backgroundColor: role === 'user'
            ? 'rgba(255, 255, 255, 0.3)'
            : theme.palette.grey[50],
        padding: theme.spacing(0.5),
        borderRadius: '4px',
        overflowX: 'auto',
        margin: theme.spacing(0.25, 0),
    },
    '& code': {
        backgroundColor: role === 'user'
            ? 'rgba(255, 255, 255, 0.3)'
            : theme.palette.grey[50],
        padding: '1px 3px',
        borderRadius: '2px',
        fontSize: '0.9em',
    },
    '& p': {
        margin: 0,
        lineHeight: 1.2,
        fontSize: '0.92rem',
        padding: '1px 0',
    },
    '& p:not(:last-child)': {
        marginBottom: '0.15em',
    },
}));

const StyledDrawer = styled(MuiDrawer)({
    '& .MuiDrawer-paper': {
        width: 240,
        boxSizing: 'border-box',
        backgroundColor: '#f8f9fa',
        border: 'none',
        borderRadius: '16px 0 0 16px',
    },
});

/**
 * 聊天请求参数类型
 */
interface ChatRequest {
    question: string;
    provider: string;
}

/**
 * 聊天响应类型
 */
interface ChatResponse {
    code: number;
    response: string;
    success: boolean;
}

/**
 * 向后端发送聊天请求
 */
const askQuestion = async (question: string, modelId: Model['id']): Promise<string> => {
    try {
        const chatRequest: ChatRequest = {
            question: question,
            provider: MODEL_PROVIDER_MAP[modelId]
        };

        const response = await fetch('http://localhost:5000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(chatRequest)
        });

        const data: ChatResponse = await response.json();

        if (data.success && data.code === 200) {
            return data.response;
        } else {
            throw new Error(data.response || '服务器返回错误');
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

const ChatPage: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [selectedModel, setSelectedModel] = useState(models[0]);
    const [modelMenuAnchor, setModelMenuAnchor] = useState<null | HTMLElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            role: 'user',
            content: input
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const aiResponse = await askQuestion(input, selectedModel.id);
            const assistantMessage: Message = {
                role: 'assistant',
                content: aiResponse
            };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('发送消息失败:', error);
            const errorMessage: Message = {
                role: 'assistant',
                content: error instanceof Error
                    ? `错误: ${error.message}`
                    : '抱歉，发生了未知错误，请稍后重试。'
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleModelSelect = (model: Model) => {
        setSelectedModel(model);
        setModelMenuAnchor(null);
    };

    return (
        <PageContainer>
            <StyledDrawer
                variant="permanent"
                sx={{
                    width: 240,
                    flexShrink: 0,
                }}
            >
                <SidebarContent>
                    <Logo>
                        <Typography variant="h6">NextChat</Typography>
                        <Typography variant="body2" color="textSecondary">
                            Build your own AI assistant.
                        </Typography>
                    </Logo>
                    <ModelSelector
                        onClick={(e) => setModelMenuAnchor(e.currentTarget)}
                    >
                        <ModelIcon>{selectedModel.icon}</ModelIcon>
                        <ModelInfo>
                            <Typography variant="subtitle2">当前模型</Typography>
                            <Typography variant="body2" color="textSecondary">
                                {selectedModel.name}
                            </Typography>
                        </ModelInfo>
                        <KeyboardArrowDownIcon />
                    </ModelSelector>
                    <Menu
                        anchorEl={modelMenuAnchor}
                        open={Boolean(modelMenuAnchor)}
                        onClose={() => setModelMenuAnchor(null)}
                    >
                        {models.map((model) => (
                            <MenuItem
                                key={model.id}
                                onClick={() => handleModelSelect(model)}
                                selected={model.id === selectedModel.id}
                            >
                                <ListItemIcon sx={{ fontSize: '1.2rem' }}>
                                    {model.icon}
                                </ListItemIcon>
                                <ListItemText>{model.name}</ListItemText>
                            </MenuItem>
                        ))}
                    </Menu>
                    <NavButtons>
                        <NavButton startIcon={<FaceIcon />}>面具</NavButton>
                        <NavButton startIcon={<ExploreIcon />}>发现</NavButton>
                        <NavButton startIcon={<SettingsIcon />}>设置</NavButton>
                    </NavButtons>
                </SidebarContent>
            </StyledDrawer>

            <MainContent>
                <ChatHeader>
                    <Typography variant="h6">新的聊天</Typography>
                    <Typography variant="body2" color="textSecondary">
                        共 {messages.length} 条对话
                    </Typography>
                    <HeaderActions>
                        <IconButton><RefreshIcon /></IconButton>
                        <IconButton><EditIcon /></IconButton>
                        <IconButton><ShareIcon /></IconButton>
                        <IconButton><FullscreenIcon /></IconButton>
                    </HeaderActions>
                </ChatHeader>

                <MessagesContainer>
                    {messages.map((message, index) => (
                        <MessageBubble
                            key={index}
                            role={message.role}
                            content={message.content}
                        />
                    ))}
                    <div ref={chatEndRef} />
                </MessagesContainer>

                <InputContainer>
                    <ActionButtons>
                        <IconButton size="small"><EmojiEmotionsIcon /></IconButton>
                        <IconButton size="small"><ImageIcon /></IconButton>
                        <IconButton size="small"><AttachFileIcon /></IconButton>
                        <IconButton size="small"><AppsIcon /></IconButton>
                    </ActionButtons>
                    <StyledTextField
                        fullWidth
                        placeholder="有什么可以帮你的吗"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                        disabled={isLoading}
                        multiline
                        maxRows={4}
                    />
                    <SendButton
                        onClick={sendMessage}
                        disabled={isLoading || !input.trim()}
                    >
                        <SendIcon />
                    </SendButton>
                </InputContainer>
                {isLoading && <StyledLinearProgress />}
                <InputHint>
                    Enter 发送，Shift + Enter 换行，/触发命令，:触发表情
                </InputHint>
            </MainContent>
        </PageContainer>
    );
};

export default ChatPage; 