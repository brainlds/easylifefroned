import React, { useState, useCallback } from 'react';
import { Layout } from '../components/layout';
import { Grid, Typography, Paper, Box, Select, MenuItem, FormControl, InputLabel, Card, IconButton, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ToolCard } from '../components/tool-card';
import { Tool } from '../models/tool';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageIcon from '@mui/icons-material/Image';
import PsychologyIcon from '@mui/icons-material/Psychology';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

/**
 * 测试请求响应类型
 */
interface TestResponse {
    code: number;
    success: boolean;
    data: {
        questions: Array<{
            id: number;
            content: string;
            option_a: string;
            option_b: string;
            dimension_a: string;
            dimension_b: string;
        }>;
        test_type: string;
        total: number;
    };
}

/**
 * 发送测试请求
 */
const fetchTest = async (type: string): Promise<TestResponse> => {
    try {
        const response = await fetch(`http://localhost:5000/api/test?type=${type}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        if (data.success) {
            return data;
        } else {
            throw new Error(data.error || '获取测试题目失败');
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

const testCards: Omit<Tool, 'category'>[] = [
    {
        id: 'mbti',
        name: 'MBTI性格测试',
        description: '迈尔斯-布里格斯类型指标测试，帮助了解您的性格类型和职业倾向',
        icon: '🎯',
        isNew: true,
    },
    {
        id: 'holland',
        name: '霍兰德职业兴趣测试',
        description: '基于六种职业兴趣类型，帮助您找到最适合的职业方向',
        icon: '💼',
        isNew: false,
    },
    {
        id: 'enneagram',
        name: '九型人格测试',
        description: '探索您的核心动机和行为模式，提升自我认知',
        icon: '🎭',
        isNew: false,
    }
];

export const PersonalityTests: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Layout>
            <MainContent>
                <Box sx={{ position: 'absolute', left: 24, top: 24 }}>
                    <Tooltip title="返回主页">
                        <IconButton
                            onClick={() => navigate('/')}
                            sx={{
                                bgcolor: 'background.paper',
                                boxShadow: 1,
                                '&:hover': {
                                    bgcolor: 'grey.100',
                                },
                            }}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                    </Tooltip>
                </Box>

                <Header>
                    <Typography variant="h4" gutterBottom>
                        性格测试
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        专业的性格测试工具，帮助您更好地认识自己
                    </Typography>
                </Header>

                <Grid container spacing={4}>
                    {/* 测试卡片部分 */}
                    <Grid item xs={12}>
                        <Grid container spacing={3}>
                            {testCards.map(test => (
                                <Grid item xs={12} md={4} key={test.id}>
                                    <ToolCard
                                        tool={{
                                            ...test,
                                            category: 'test',
                                            isFeatured: false,
                                        }}
                                        onFavorite={() => { }}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </MainContent>
        </Layout>
    );
};

const MainContent = styled('main')({
    padding: '2rem',
    minHeight: 'calc(100vh - 64px - 100px)',
    backgroundColor: '#f5f5f5',
});

const Header = styled('div')({
    textAlign: 'center',
    marginBottom: '3rem',
}); 