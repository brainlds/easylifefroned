import React from 'react';
import { Layout } from '../components/layout';
import { Box, Typography, Button, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';

interface PaymentState {
    totalCost: number;
    orderId: string;
}

const PaymentPage: React.FC = () => {
    const location = useLocation();
    const { totalCost, orderId }: PaymentState = location.state as PaymentState;

    return (
        <Layout>
            <Container>
                <Paper elevation={3} sx={{ padding: '2rem', textAlign: 'center' }}>
                    <Typography variant="h4" gutterBottom>
                        购买成功
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        感谢您的购买！您的订单 ID 是: {orderId}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        您的总花费为: ¥{totalCost}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => window.location.href = '/'}
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