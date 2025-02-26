import React from 'react';
import { Layout } from '../components/layout';
import { Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ToolCard } from '../components/tool-card';
import { Tool } from '../models/tool';

type AIModel = Omit<Tool, 'category' | 'isFeatured'> & {
    link: string;
};

const aiModels: AIModel[] = [
    {
        id: 'volcano',
        name: '火山引擎',
        description: '字节跳动开发的大语言模型，支持中英双语对话和各类任务',
        icon: '🌋',
        isNew: true,
        link: 'https://www.volcengine.com/',
    },
    {
        id: 'hunyuan',
        name: '腾讯混元',
        description: '腾讯自研的大语言模型，擅长中文创作和对话',
        icon: '🔮',
        isNew: true,
        link: 'https://hunyuan.tencent.com/',
    },
    {
        id: 'midjourney',
        name: 'Midjourney',
        description: '专业的AI绘画工具，生成高质量艺术作品',
        icon: '🎨',
        isNew: false,
        link: 'https://www.midjourney.com/',
    },
    {
        id: 'suno',
        name: 'Suno AI',
        description: 'AI音乐创作工具，可生成完整歌曲和音乐片段',
        icon: '🎵',
        isNew: true,
        link: 'https://www.suno.ai/',
    },
    {
        id: 'sd',
        name: 'Stable Diffusion',
        description: '开源的AI绘画模型，支持多种图像生成和编辑功能',
        icon: '🖼️',
        isNew: false,
        link: 'https://stability.ai/',
    },
];

export const AIModels: React.FC = () => {
    const handleModelClick = (link: string) => {
        window.open(link, '_blank');
    };

    return (
        <Layout>
            <MainContent>
                <Header>
                    <Typography variant="h4" gutterBottom>
                        AI 模型库
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        集成多种前沿 AI 模型，满足不同创作需求
                    </Typography>
                </Header>
                <ModelsSection>
                    <Grid container spacing={4}>
                        {aiModels.map(model => (
                            <Grid item xs={12} sm={6} md={4} key={model.id}>
                                <ToolCard
                                    tool={{
                                        ...model,
                                        category: 'dev' as const,
                                        isFeatured: false,
                                    }}
                                    onFavorite={() => { }}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </ModelsSection>
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

const ModelsSection = styled('section')({
    maxWidth: '1200px',
    margin: '0 auto',
});

export { }; 