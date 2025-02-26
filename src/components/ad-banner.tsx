import React from 'react';
import { Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const AdBanner: React.FC = () => {
    return (
        <AdContainer elevation={0}>
            <Typography variant="body2" color="textSecondary">
                AD: 专业云服务解决方案
            </Typography>
        </AdContainer>
    );
};

const AdContainer = styled(Paper)(({ theme }) => ({
    padding: '16px',
    margin: '16px',
    backgroundColor: '#f5f5f5',
    textAlign: 'center',
})); 