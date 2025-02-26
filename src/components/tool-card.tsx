import React from 'react';
import { Card, CardActionArea, CardContent as MuiCardContent, Chip, IconButton, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Tool } from '../models/tool';
import { useNavigate } from 'react-router-dom';

interface ToolCardProps {
    tool: Tool & { isFavorite?: boolean; disabled?: boolean; disabledReason?: string };
    onFavorite: (id: string) => void;
    onClick?: () => void;
}

const StyledCard = styled(Card)<{ $disabled?: boolean }>(({ theme, $disabled }) => ({
    transition: 'transform 0.2s',
    '&:hover': {
        transform: $disabled ? 'none' : 'translateY(-4px)',
        boxShadow: $disabled ? theme.shadows[1] : theme.shadows[4],
    },
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    opacity: $disabled ? 0.6 : 1,
    cursor: $disabled ? 'not-allowed' : 'pointer',
}));

const StyledCardContent = styled(MuiCardContent)({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
});

const ToolIcon = styled('div')({
    fontSize: '2.5rem',
    marginBottom: '8px',
});

const ToolHeader = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
});

const ToolTags = styled('div')({
    display: 'flex',
    gap: '4px',
    marginTop: '8px',
});

const DisabledOverlay = styled(Box)({
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.75rem',
});

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onFavorite, onClick }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (tool.disabled) {
            return;
        }

        if (onClick) {
            onClick();
            return;
        }

        if (tool.id === 'photo-qa') { // 拍照答题
            navigate('/photo-qa'); // 跳转到拍照答题页面
        } else if (tool.id === '5') { // 大语言模型
            navigate('/chat');
        } else if (tool.id === '1') { // 性格测试
            navigate('/personality-tests');
        } else if (tool.id === '2') { // 开发工具
            navigate('/dev-tools');
        } else if (tool.id === '7') { // 其他模型
            navigate('/ai-models');
        } else if (tool.id === '8') { // 命理学
            navigate('/divination');
        } else if (tool.id === '4') { // 我的学习
            navigate('/learning');
        } else if (tool.id === '6') { // 娱乐
            navigate('/entertainment');
        } else if (tool.id === '3') { // 实用工具
            navigate('/utils');
        } else if (tool.id === 'customer-service') {
            navigate('/customer-service');
        } else if (tool.id === 'workflow') {
            navigate('/workflow');
        } else if (tool.id === 'mbti') { // MBTI性格测试
            navigate('/tests?type=mbti');
        } else if (tool.id === 'holland') { // 霍兰德职业兴趣测试
            navigate('/tests?type=career');
        } else if (tool.id === 'enneagram') { // 九型人格测试
            navigate('/tests?type=enneagram');
        } else if (tool.id === 'agents') { // 智能体
            navigate('/agents');
        } else if (tool.id === 'travel-planner') {
            navigate('/travel-planner');
        } else if (tool.id === 'script') {
            navigate('/scripts');
        } else if (tool.link) {
            window.open(tool.link, '_blank');
        }
    };

    return (
        <StyledCard $disabled={tool.disabled}>
            <CardActionArea
                onClick={handleClick}
                disabled={tool.disabled}
            >
                <StyledCardContent>
                    <ToolHeader>
                        <ToolIcon>{tool.icon}</ToolIcon>
                        <IconButton
                            onClick={(e) => {
                                e.stopPropagation();
                                onFavorite(tool.id);
                            }}
                        >
                            <FavoriteIcon color={tool.isFavorite ? 'error' : 'inherit'} />
                        </IconButton>
                    </ToolHeader>
                    <Typography variant="h6" gutterBottom>
                        {tool.name}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ flex: 1 }}
                    >
                        {tool.description}
                    </Typography>
                    <ToolTags>
                        {tool.isNew && (
                            <Chip
                                label="NEW"
                                size="small"
                                color="primary"
                                sx={{ borderRadius: '4px' }}
                            />
                        )}
                        {tool.isFeatured && (
                            <Chip
                                label="HOT"
                                size="small"
                                color="secondary"
                                sx={{ borderRadius: '4px' }}
                            />
                        )}
                    </ToolTags>
                    {tool.disabled && (
                        <DisabledOverlay>
                            {tool.disabledReason}
                        </DisabledOverlay>
                    )}
                </StyledCardContent>
            </CardActionArea>
        </StyledCard>
    );
}; 