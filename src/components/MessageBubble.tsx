import React from 'react';
import { Box, styled } from '@mui/material';
import { MessageBubbleProps } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const Bubble = styled(Box)(({ theme, role }: { theme?: any; role: string }) => ({
    display: 'inline-block',
    padding: theme.spacing(1.5, 2),
    borderRadius: theme.shape.borderRadius,
    maxWidth: '70%',
    backgroundColor: role === 'user' ? theme.palette.primary.main : theme.palette.grey[100],
    color: role === 'user' ? theme.palette.primary.contrastText : theme.palette.text.primary,
    alignSelf: role === 'user' ? 'flex-end' : 'flex-start',
    '& pre': {
        backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#f5f5f5',
        padding: theme.spacing(1),
        borderRadius: theme.shape.borderRadius,
        overflowX: 'auto',
    },
}));

const MessageBubble = ({ role, content }: MessageBubbleProps) => {
    return (
        <Box sx={{ my: 1, display: 'flex', justifyContent: role === 'user' ? 'flex-end' : 'flex-start' }}>
            <Bubble role={role}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            </Bubble>
        </Box>
    );
};

export default MessageBubble; 