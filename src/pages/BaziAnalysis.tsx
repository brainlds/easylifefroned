import React, { useState } from 'react';
import { Layout } from '../components/layout';
import { Box, Typography, Paper, TextField, Button, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/zh-cn';

const BaziAnalysis: React.FC = () => {
    const [birthTime, setBirthTime] = useState<Dayjs | null>(null);
    const [birthPlace, setBirthPlace] = useState<string>('');
    const [result, setResult] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = async () => {
        if (!birthTime || !birthPlace) {
            setErrorMessage('请填写出生时间和出生地点');
            return;
        }

        setIsLoading(true);
        setErrorMessage(null);

        const requestData = {
            birth_time: birthTime.format('YYYY-MM-DD HH:mm'),
            birth_place: birthPlace,
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/bazi/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            const data = await response.json();
            if (data.success) {
                setResult(data.data);
            } else {
                setErrorMessage(data.message);
            }
        } catch (error) {
            console.error('请求失败:', error);
            setErrorMessage('请求失败，请检查网络连接。');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout>
            <Container>
                <StyledPaper elevation={3}>
                    <Typography variant="h4" gutterBottom>
                        八字分析
                    </Typography>
                    <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
                        通过选择自己的出生年月和地点生成自己的人生运势和性格特点
                    </Typography>

                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                            <Grid item xs={12} md={6}>
                                <DateTimePicker
                                    label="出生时间"
                                    value={birthTime}
                                    onChange={(newValue: Dayjs | null) => setBirthTime(newValue)}
                                    sx={{ width: '100%' }}
                                    format="YYYY-MM-DD HH:mm"
                                    ampm={false}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="出生地点"
                                    value={birthPlace}
                                    onChange={(e) => setBirthPlace(e.target.value)}
                                    placeholder="例如：北京海淀区"
                                />
                            </Grid>
                        </Grid>
                    </LocalizationProvider>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        size="large"
                        sx={{ minWidth: 200 }}
                    >
                        {isLoading ? '分析中...' : '生成运势'}
                    </Button>

                    {errorMessage && (
                        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                            {errorMessage}
                        </Typography>
                    )}

                    {result && (
                        <ResultBox>
                            <Typography variant="h6" gutterBottom>
                                分析结果:
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    whiteSpace: 'pre-line',
                                    textAlign: 'left',
                                    lineHeight: 1.8
                                }}
                            >
                                {result}
                            </Typography>
                        </ResultBox>
                    )}
                </StyledPaper>
            </Container>
        </Layout>
    );
};

const Container = styled(Box)({
    padding: '2rem',
    backgroundColor: '#f5f5f5',
    minHeight: 'calc(100vh - 64px)',
});

const StyledPaper = styled(Paper)({
    padding: '2rem',
    textAlign: 'center',
    borderRadius: '12px',
    maxWidth: '1000px',
    margin: '0 auto',
});

const ResultBox = styled(Box)({
    marginTop: '2rem',
    padding: '2rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
});

export default BaziAnalysis; 