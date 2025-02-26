import React from 'react';
import { Layout } from '../components/layout';
import { Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ToolCard } from '../components/tool-card';
import { Tool } from '../models/tool';

type EntertainmentResource = Omit<Tool, 'category' | 'isFeatured'> & {
    link: string;
};

const entertainmentResources: EntertainmentResource[] = [
    {
        id: 'music',
        name: '音乐资源',
        description: '免费音乐下载、在线试听、歌单推荐、音乐播放器',
        icon: '🎵',
        isNew: true,
        link: 'https://tools.liumingye.cn/music/?page=searchPage#/',
    },
    {
        id: 'video',
        name: '视频资源',
        description: '免费视频观看、影视解析、视频下载、直播资源',
        icon: '🎬',
        isNew: true,
        link: 'https://www.yunbo123.com/',
    }
];

export const Entertainment: React.FC = () => {
    return (
        <Layout>
            <MainContent>
                <Header>
                    <Typography variant="h4" gutterBottom>
                        娱乐资源
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        精选音乐视频资源，丰富您的娱乐生活
                    </Typography>
                </Header>
                <ResourcesSection>
                    <Grid container spacing={4} justifyContent="center">
                        {entertainmentResources.map(resource => (
                            <Grid item xs={12} sm={6} md={4} key={resource.id}>
                                <ToolCard
                                    tool={{
                                        ...resource,
                                        category: 'entertainment' as const,
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