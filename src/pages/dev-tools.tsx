import React from 'react';
import { Layout } from '../components/layout';
import { Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ToolCard } from '../components/tool-card';
import { Tool } from '../models/tool';

// 修改 DevTool 接口，确保与 Tool 类型兼容
type DevTool = Omit<Tool, 'category' | 'isFeatured'>;

const devTools: Omit<Tool, 'category'>[] = [
    {
        id: 'agents',
        name: '智能体',
        description: '专业的AI助手，为您提供各类智能服务',
        icon: '🤖',
        isNew: true,
        link: 'https://www.example.com/agents',
    },
    {
        id: 'workflow',
        name: '工作流',
        description: '可视化工作流编排，自动化处理复杂任务流程',
        icon: '⚡',
        isNew: true,
        link: 'https://www.example.com/workflow',
    },
    {
        id: 'plugin',
        name: '插件',
        description: '扩展系统功能的插件开发工具，支持多种集成方式',
        icon: '🔌',
        isNew: true,
        link: 'https://www.tampermonkey.net/index.php?browser=chrome&locale=zh',
    },
    {
        id: 'script',
        name: '脚本',
        description: '编写自动化脚本，处理数据转换和系统交互',
        icon: '📜',
        isNew: false,
        link: 'https://www.example.com/scripts',
    },
];

export const DevTools: React.FC = () => {
    return (
        <Layout>
            <MainContent>
                <Header>
                    <Typography variant="h4" gutterBottom>
                        开发工具
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        提供各种开发和生产力工具
                    </Typography>
                </Header>
                <ToolsSection>
                    <Grid container spacing={4}>
                        {devTools.map(tool => (
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
    minHeight: 'calc(100vh - 64px - 100px)',
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

// 添加空导出使文件成为模块
export { }; 