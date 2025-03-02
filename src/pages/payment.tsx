import React from 'react';
import { Layout } from '../components/layout';
import { Box, Typography, Button, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useLocation, useNavigate } from 'react-router-dom';

interface PaymentState {
    orderId: string;
    purchaseData: {
        totalCost: number;
        // ... 其他购买数据
    };
}

const PaymentPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as PaymentState;

    // 确保有 state 和 totalCost
    const totalCost = state?.purchaseData?.totalCost || 0;

    return (
        <Layout>
            <Container>
                <Paper elevation={3} sx={{ padding: '2rem', textAlign: 'center' }}>
                    <Typography variant="h4" gutterBottom>
                        购买成功
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        感谢您的购买！
                    </Typography>
                    <Typography variant="body1" gutterBottom color="primary" sx={{ fontSize: '1.2rem', my: 3 }}>
                        总花费: ¥{totalCost}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/')}
                        sx={{ mt: 2 }}
                    >
                        返回首页
                    </Button>
                </Paper>
            </Container>
        </Layout>
    );
};

const Container = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
});

export default PaymentPage; 