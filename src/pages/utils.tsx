import React from 'react';
import { Layout } from '../components/layout';
import { Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ToolCard } from '../components/tool-card';
import { Tool } from '../models/tool';

type UtilityTool = Omit<Tool, 'category' | 'isFeatured'> & {
    link: string;
};

const utilityTools: UtilityTool[] = [
    {
        id: 'image-compress',
        name: '图片压缩',
        description: '在线图片压缩工具，支持JPG、PNG等格式，快速压缩不失真',
        icon: '🖼️',
        isNew: false,
        link: 'https://tinypng.com/',
    },
    {
        id: 'video-parse',
        name: '视频解析',
        description: '支持各大视频平台VIP视频在线解析和下载',
        icon: '🎥',
        isNew: true,
        link: 'https://tools.liumingye.cn/video/',
    },
    {
        id: 'json-validator',
        name: 'JSON格式校验',
        description: 'JSON在线格式化、校验、压缩、转换工具',
        icon: '📝',
        isNew: false,
        link: 'https://www.json.cn/',
    },
    {
        id: 'flowchart',
        name: '流程图工具',
        description: '在线流程图、思维导图、UML图等绘制工具',
        icon: '📊',
        isNew: true,
        link: 'https://www.processon.com/',
    },
    {
        id: 'bg-remover',
        name: '消除图片背景',
        description: '智能在线抠图工具，快速移除图片背景',
        icon: '✂️',
        isNew: true,
        link: 'https://www.remove.bg/',
    }
];

export const Utils: React.FC = () => {
    return (
        <Layout>
            <MainContent>
                <Header>
                    <Typography variant="h4" gutterBottom>
                        实用工具
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        精选高效实用的在线工具，提升工作效率
                    </Typography>
                </Header>
                <ToolsSection>
                    <Grid container spacing={4}>
                        {utilityTools.map(tool => (
                            <Grid item xs={12} sm={6} md={4} key={tool.id}>
                                <ToolCard
                                    tool={{
                                        ...tool,
                                        category: 'utils' as const,
                                        isFeatured: false,
                                    }}
                                    onFavorite={() => { }}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </ToolsSection>
            </MainContent>
        </Layout>
    );
};

const MainContent = styled('main')({
    padding: '2rem',
    minHeight: 'calc(150vh - 64px - 100px)',
    backgroundColor: '#f5f5f5',
});

const Header = styled('div')({
    textAlign: 'center',
    marginBottom: '3rem',
});

const ToolsSection = styled('section')({
    maxWidth: '1200px',
    margin: '0 auto',
});

export { }; 