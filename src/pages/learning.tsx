import React from 'react';
import { Layout } from '../components/layout';
import { Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ToolCard } from '../components/tool-card';
import { Tool } from '../models/tool';

type LearningResource = Omit<Tool, 'category' | 'isFeatured'> & {
    link: string;
    disabled: boolean;
    disabledReason: string;
};

const learningResources: LearningResource[] = [
    {
        id: 'ai-learning',
        name: 'AI 学习',
        description: '人工智能、机器学习、深度学习等AI技术学习资源',
        icon: '🤖',
        isNew: true,
        link: 'https://www.deeplearning.ai/',
        disabled: true,
        disabledReason: '即将上线',
    },
    {
        id: 'python-learning',
        name: 'Python 学习',
        description: 'Python 编程语言基础、进阶教程和实战项目',
        icon: '🐍',
        isNew: false,
        link: 'https://www.python.org/about/gettingstarted/',
        disabled: true,
        disabledReason: '即将上线',
    },
    {
        id: 'java-learning',
        name: 'Java 学习',
        description: 'Java 编程语言教程、框架学习和项目实践',
        icon: '☕',
        isNew: false,
        link: 'https://dev.java/learn/',
        disabled: true,
        disabledReason: '即将上线',
    },
    {
        id: 'web3-learning',
        name: 'Web3 学习',
        description: '区块链技术、智能合约和去中心化应用的学习资源',
        icon: '🌐',
        isNew: true,
        link: 'https://web3.foundation/',
        disabled: true,
        disabledReason: '即将上线',
    },
    {
        id: 'psychology-learning',
        name: '心理学',
        description: '心理学基础、心理健康和心理治疗的学习资源',
        icon: '🧠',
        isNew: true,
        link: 'https://www.apa.org/',
        disabled: true,
        disabledReason: '即将上线',
    },
    {
        id: 'philosophy-learning',
        name: '哲学',
        description: '哲学基础、伦理学、逻辑学和哲学思考的学习资源',
        icon: '📚',
        isNew: true,
        link: 'https://plato.stanford.edu/',
        disabled: true,
        disabledReason: '即将上线',
    },
];

export const Learning: React.FC = () => {
    return (
        <Layout>
            <MainContent>
                <Header>
                    <Typography variant="h4" gutterBottom>
                        学习资源
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        精选编程语言和技术学习资源，助力技术成长
                    </Typography>
                </Header>
                <ResourcesSection>
                    <Grid container spacing={4}>
                        {learningResources.map(resource => (
                            <Grid item xs={12} sm={6} md={4} key={resource.id}>
                                <ToolCard
                                    tool={{
                                        ...resource,
                                        category: 'dev' as const,
                                        isFeatured: false,
                                    }}
                                    onFavorite={() => { }}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </ResourcesSection>
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

const ResourcesSection = styled('section')({
    maxWidth: '1200px',
    margin: '0 auto',
});

export { }; 