import React from 'react';
import { Paper, Typography, Box, CircularProgress, styled, Button } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';

interface TestReportProps {
    analysis?: string;
    loading?: boolean;
    testType?: string;
    onRetry?: () => void;
    onRetest?: () => void;
    error?: boolean;
}

const ReportContainer = styled(Paper)(({ theme }) => ({
    maxWidth: 800,
    margin: '2rem auto',
    padding: '2rem',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
}));

const LoadingContainer = styled(Box)({
    padding: '3rem',
    textAlign: 'center',
});

const MarkdownContainer = styled(Box)({
    '& h3': {
        color: '#1976d2',
        marginTop: '2rem',
        marginBottom: '1rem',
        fontSize: '1.5rem',
    },
    '& p': {
        marginBottom: '1rem',
        lineHeight: 1.6,
    },
    '& ul': {
        paddingLeft: '2rem',
        marginBottom: '1rem',
    },
    '& li': {
        marginBottom: '0.5rem',
    },
    '& strong': {
        color: '#1976d2',
    },
});

const ButtonContainer = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '2rem',
});

export const TestReport: React.FC<TestReportProps> = ({
    analysis,
    loading,
    testType,
    onRetry,
    onRetest,
    error = false
}) => {
    const navigate = useNavigate();

    if (loading) {
        return (
            <ReportContainer>
                <LoadingContainer>
                    <CircularProgress size={40} />
                    <Typography variant="h6" color="textSecondary" sx={{ mt: 2 }}>
                        正在生成您的个性化报告...
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        这可能需要几秒钟时间
                    </Typography>
                </LoadingContainer>
            </ReportContainer>
        );
    }

    if (error) {
        return (
            <ReportContainer>
                <Typography variant="h6" color="error" gutterBottom>
                    生成报告失败
                </Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                    请重新提交测试结果
                </Typography>
                <ButtonContainer>
                    <Button variant="contained" color="primary" onClick={onRetry}>
                        重新提交
                    </Button>
                </ButtonContainer>
            </ReportContainer>
        );
    }

    if (!analysis) return null;

    return (
        <ReportContainer>
            <MarkdownContainer>
                <ReactMarkdown>{analysis}</ReactMarkdown>
            </MarkdownContainer>
            <ButtonContainer>
                <Button
                    variant="outlined"
                    onClick={() => navigate('/personality-tests')}
                >
                    返回测试列表
                </Button>
                <Button
                    variant="contained"
                    onClick={onRetest}
                >
                    再次测试
                </Button>
            </ButtonContainer>
        </ReportContainer>
    );
}; 