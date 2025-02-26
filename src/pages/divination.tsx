import React from 'react';
import { Layout } from '../components/layout';
import { Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ToolCard } from '../components/tool-card';
import { Tool } from '../models/tool';
import { useNavigate } from 'react-router-dom';

const divinationTools: Omit<Tool, 'category'>[] = [
    {
        id: 'bazi',
        name: '八字',
        description: '基于生辰八字的命理分析，解读人生运势和性格特点',
        icon: '🎯',
        isNew: true,
        link: '/bazi-analysis',
    },
    {
        id: 'ziwei',
        name: '紫微斗数',
        description: '东方占星学，通过星盘解读人生命运和各方面运势',
        icon: '⭐',
        isNew: false,
        link: 'https://www.ziwei.me',
        disabled: true,
        disabledReason: '即将上线',
    },
    {
        id: 'liuyao',
        name: '六爻',
        description: '易经六爻预测，解答具体事项的吉凶趋势',
        icon: '☯️',
        isNew: false,
        link: 'https://www.zhouyi.cc/liuyao',
        disabled: true,
        disabledReason: '开发中',
    },
    {
        id: 'qimen',
        name: '奇门遁甲',
        description: '古代术数学，用于预测时局和选择吉时',
        icon: '🎲',
        isNew: true,
        link: 'https://www.qimendunjia.com',
        disabled: true,
        disabledReason: '即将上线',
    },
    {
        id: 'tarot',
        name: '塔罗牌',
        description: '西方占卜工具，通过牌阵解读命运和心理',
        icon: '🎴',
        isNew: true,
        link: 'https://www.tarot.com',
        disabled: true,
        disabledReason: '开发中',
    },
    {
        id: 'fengshui',
        name: '风水',
        description: '传统堪舆学，研究环境对人的影响',
        icon: '🏠',
        isNew: false,
        link: 'https://www.fengshuied.com',
        disabled: true,
        disabledReason: '即将上线',
    }
];

export const Divination: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Layout>
            <MainContent>
                <Header>
                    <Typography variant="h4" gutterBottom>
                        命理学
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        传统命理预测工具，探索东西方玄学智慧
                    </Typography>
                </Header>
                <ToolsSection>
                    <Grid container spacing={4}>
                        {divinationTools.map(tool => (
                            <Grid item xs={12} sm={6} md={4} key={tool.id}>
                                <ToolCard
                                    tool={{
                                        ...tool,
                                        category: 'divination' as const,
                                        isFeatured: false,
                                    }}
                                    onFavorite={() => { }}
                                    onClick={() => {
                                        if (tool.link) {
                                            navigate(tool.link);
                                        }
                                    }}
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