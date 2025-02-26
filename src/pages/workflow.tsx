import React from 'react';
import { Layout } from '../components/layout';
import { Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ToolCard } from '../components/tool-card';
import { Tool } from '../models/tool';

const workflowTools: Omit<Tool, 'category'>[] = [
    {
        id: 'coze',
        name: 'Coze',
        description: '字节跳动推出的AI工作流编排平台，快速构建AI应用',
        icon: '⚡',
        isNew: true,
        link: 'https://www.coze.cn',
    },
    {
        id: 'dify',
        name: 'Dify',
        description: '开源的AI工作流平台，支持多种LLM模型和插件集成',
        icon: '🔌',
        isNew: true,
        disabled: true,
        disabledReason: '即将上线',
    }
];

export const Workflow: React.FC = () => {
    return (
        <Layout>
            <MainContent>
                <Header>
                    <Typography variant="h4" gutterBottom>
                        工作流
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        可视化工作流编排，自动化处理复杂任务流程
                    </Typography>
                </Header>
                <ToolsSection>
                    <Grid container spacing={4}>
                        {workflowTools.map(tool => (
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

export { }; 