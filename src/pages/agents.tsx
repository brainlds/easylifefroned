import React from 'react';
import { Layout } from '../components/layout';
import { Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ToolCard } from '../components/tool-card';
import { Tool } from '../models/tool';

const agentTools: Omit<Tool, 'category'>[] = [
    {
        id: 'travel-planner',
        name: '出行规划',
        description: '智能旅行助手，帮助规划行程、推荐景点和制定详细日程',
        icon: '✈️',
        isNew: true,
        link: 'https://travel-planner.example.com'
    },
    {
        id: 'customer-service',
        name: '智能客服',
        description: '24/7全天候客户服务助手，可以处理常见问题咨询和服务请求',
        icon: '👨‍💼',
        isNew: true,
        link: 'https://customer-service.example.com'
    },
    {
        id: 'meeting-report',
        name: '周会汇报',
        description: '自动生成工作周报和会议总结，提高工作效率',
        icon: '📊',
        isNew: true,
        link: 'https://meeting-report.example.com',
        disabled: true,
        disabledReason: '开发中',
    },
    {
        id: 'code-assistant',
        name: '代码助手',
        description: '智能代码生成和优化建议，提高开发效率',
        icon: '💻',
        isNew: true,
        disabled: true,
        disabledReason: '开发中',
    },
    {
        id: 'data-analyst',
        name: '数据分析',
        description: '智能数据分析和可视化，快速获取数据洞察',
        icon: '📊',
        isNew: true,
        disabled: true,
        disabledReason: '即将上线',
    },
    {
        id: 'content-writer',
        name: '内容创作',
        description: '智能文案生成和内容优化，提升创作效率',
        icon: '✍️',
        isNew: true,
        disabled: true,
        disabledReason: '开发中',
    }
];

export const Agents: React.FC = () => {
    return (
        <Layout>
            <MainContent>
                <Header>
                    <Typography variant="h4" gutterBottom>
                        智能体
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        专业的AI助手，为您提供各类智能服务
                    </Typography>
                </Header>
                <ToolsSection>
                    <Grid container spacing={4}>
                        {agentTools.map(tool => (
                            <Grid item xs={12} sm={6} md={4} key={tool.id}>
                                <ToolCard
                                    tool={{
                                        ...tool,
                                        category: 'dev' as const,
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