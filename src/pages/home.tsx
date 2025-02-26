import React, { useState } from 'react';
import { Layout } from '../components/layout';
import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ToolCard } from '../components/tool-card';
import { Tool } from '../models/tool';

const mockTools: Tool[] = [
    {
        id: '2',
        name: '开发工具',
        category: 'dev',
        description: '智能体、工作流、插件、脚本等开发工具',
        icon: '🛠️',
        isFeatured: true,
        isNew: false,
    },
    {
        id: '5',
        name: '大语言模型',
        category: 'dev',
        description: 'ChatGPT、Deepseek、通义千问等AI对话模型',
        icon: '🤖',
        isFeatured: true,
        isNew: true,
        link: '/chat'
    },
    {
        id: 'photo-qa',
        name: '拍照答题',
        category: 'utils',
        description: '上传题目图片，智能识别并给出答案解析',
        icon: '📸',
        isFeatured: true,
        isNew: true,
        link: '/personality-tests'
    },
    {
        id: '1',
        name: '性格测试',
        category: 'test',
        description: 'MBTI人格测试、职业倾向测试、九型人格测试等',
        icon: '🎯',
        isFeatured: true,
        isNew: false,
    },
    {
        id: '8',
        name: '命理学',
        category: 'divination',
        description: '八字、紫微斗数、六爻、奇门遁甲、塔罗牌、风水',
        icon: '⚡',
        isFeatured: true,
        isNew: true,
    },
    {
        id: '7',
        name: '其他模型',
        category: 'dev',
        description: '火山、混元、Midjourney、Suno等AI模型',
        icon: '🎨',
        isFeatured: true,
        isNew: true,
    },

    {
        id: '6',
        name: '娱乐',
        category: 'entertainment',
        description: '免费音乐、免费视频等娱乐资源',
        icon: '🎵',
        isFeatured: true,
        isNew: true,
    },
    {
        id: '3',
        name: '实用工具',
        category: 'utils',
        description: '图片压缩、视频解析等实用工具',
        icon: '🛠️',
        isFeatured: true,
        isNew: true,
    },
    {
        id: '4',
        name: '我的学习',
        category: 'dev',
        description: 'Python、Java、AI等编程语言和技术学习资源',
        icon: '📚',
        isFeatured: false,
        isNew: true,
    }
];

/**
 * 主页组件
 * @returns 渲染的主页面
 */
export const HomePage: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [favorites, setFavorites] = useState<string[]>([]);

    const filteredTools = mockTools.filter(tool => {
        const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
        const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tool.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleFavorite = (toolId: string) => {
        setFavorites(prev =>
            prev.includes(toolId)
                ? prev.filter(id => id !== toolId)
                : [...prev, toolId]
        );
    };

    return (
        <Layout>
            <MainContent>
                <ToolSection>
                    <Grid container spacing={3}>
                        {filteredTools.map(tool => (
                            <Grid item xs={12} sm={6} md={4} key={tool.id}>
                                <ToolCard
                                    tool={{ ...tool, isFavorite: favorites.includes(tool.id) }}
                                    onFavorite={handleFavorite}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </ToolSection>
            </MainContent>
        </Layout>
    );
};

const MainContent = styled('main')({
    padding: '2rem',
    minHeight: 'calc(100vh - 64px - 100px)', // 减去头部和底部的高度
});

const ToolSection = styled('section')({
    maxWidth: '1200px',
    margin: '0 auto',
    textAlign: 'center',
});

const ToolTitle = styled('h1')({
    fontSize: '2.5rem',
    marginBottom: '1rem',
    color: '#333',
});

const ToolDescription = styled('p')({
    fontSize: '1.2rem',
    color: '#666',
    marginBottom: '2rem',
}); 