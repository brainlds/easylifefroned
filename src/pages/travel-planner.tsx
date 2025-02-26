import React, { useState } from 'react';
import { Layout } from '../components/layout';
import { Box, Typography, Paper, Grid, Card, CardContent, Icon, Button, TextField, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, FormHelperText, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import FlightIcon from '@mui/icons-material/Flight';
import HotelIcon from '@mui/icons-material/Hotel';
import MapIcon from '@mui/icons-material/Map';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import { TrainTicket, TrainTicketsResponse } from '../types/train';
import { TrainTicketList } from '../components/train-ticket-list';
import { TravelPlan, DailyPlan, Activity } from '../types/travel-plan';
import { TravelPlanDisplay } from '../components/travel-plan-display';

const features = [
    {
        icon: <FlightIcon fontSize="large" />,
        title: '智能票务规划',
        description: '根据您的时间和预算，推荐最优的交通方案和票务购买建议'
    },
    {
        icon: <HotelIcon fontSize="large" />,
        title: '住宿推荐',
        description: '基于目的地实时房态和评价，为您筛选最适合的住宿选择'
    },
    {
        icon: <MapIcon fontSize="large" />,
        title: '行程定制',
        description: '结合热门景点、当地特色和您的兴趣偏好，规划最佳游览路线'
    },
    {
        icon: <WbSunnyIcon fontSize="large" />,
        title: '天气适配',
        description: '根据目的地天气预报，动态调整行程安排，确保旅行体验'
    }
];

interface TravelPreference {
    startPoint: string;
    endPoint: string;
    startDate: string;
    endDate: string;
    budget: number;
    adultCount: number;
    childCount: number;
    travelStyle: string;
    accommodationType: string;
}

// 添加 mock 数据
const mockResponse = {
    "data": {
        "date": "2025-02-27",
        "end": "上海",
        "start": "北京",
        "trains": [
            {
                "arrival_station": "上海虹桥",
                "arrival_time": "11:58",
                "can_buy": true,
                "departure_station": "北京南",
                "departure_time": "06:20",
                "duration": "5小时38分",
                "seats": [
                    {
                        "available": true,
                        "price": 553.0,
                        "type": "二等座"
                    },
                    {
                        "available": true,
                        "price": 930.0,
                        "type": "一等座"
                    },
                    {
                        "available": true,
                        "price": 1873.0,
                        "type": "商务座"
                    }
                ],
                "train_no": "G103",
                "type": "高铁"
            },
            {
                "arrival_station": "上海",
                "arrival_time": "11:29",
                "can_buy": true,
                "departure_station": "北京南",
                "departure_time": "07:00",
                "duration": "4小时29分",
                "seats": [
                    {
                        "available": true,
                        "price": 667.0,
                        "type": "二等座"
                    },
                    {
                        "available": true,
                        "price": 1067.0,
                        "type": "一等座"
                    },
                    {
                        "available": true,
                        "price": 2331.0,
                        "type": "商务座"
                    }
                ],
                "train_no": "G1",
                "type": "高铁"
            },
            {
                "arrival_station": "上海虹桥",
                "arrival_time": "13:03",
                "can_buy": true,
                "departure_station": "北京南",
                "departure_time": "07:17",
                "duration": "5小时46分",
                "seats": [
                    {
                        "available": true,
                        "price": 553.0,
                        "type": "二等座"
                    },
                    {
                        "available": true,
                        "price": 930.0,
                        "type": "一等座"
                    },
                    {
                        "available": false,
                        "price": 1873.0,
                        "type": "商务座"
                    }
                ],
                "train_no": "G105",
                "type": "高铁"
            }
        ]
    },
    "success": true
};

// 获取当前日期的函数
const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
};

export const TravelPlanner: React.FC = () => {
    const [preferences, setPreferences] = useState<TravelPreference>({
        startPoint: '北京',  // 默认出发地
        endPoint: '上海',    // 默认目的地
        startDate: getCurrentDate(),  // 默认当天
        endDate: getCurrentDate(),    // 默认当天
        budget: 0,
        adultCount: 1,
        childCount: 0,
        travelStyle: 'relaxed',
        accommodationType: 'hotel',
    });

    const [outboundTickets, setOutboundTickets] = useState<TrainTicket[]>([]);
    const [returnTickets, setReturnTickets] = useState<TrainTicket[]>([]);
    const [ticketsLoading, setTicketsLoading] = useState(false);
    const [planGenerated, setPlanGenerated] = useState(false);
    const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null);
    const [selectedOutboundTrainNo, setSelectedOutboundTrainNo] = useState<string>('');
    const [selectedReturnTrainNo, setSelectedReturnTrainNo] = useState<string>('');
    const [showError, setShowError] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPreferences(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        const { name, value } = e.target;
        setPreferences(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        // 添加表单验证
        if (!preferences.startPoint.trim() || !preferences.endPoint.trim()) {
            // TODO: 可以添加一个更友好的错误提示，比如使用 Snackbar
            alert('出发地和目的地不能为空');
            return;
        }

        try {
            setTicketsLoading(true);
            setPlanGenerated(false);

            // 获取去程车票
            const outboundResponse = await fetch(
                `http://localhost:5000/api/train/tickets?start=${preferences.startPoint}&end=${preferences.endPoint}&date=${preferences.startDate}`
            );
            const outboundData = await outboundResponse.json();
            if (outboundData.success) {
                setOutboundTickets(outboundData.data.trains);
            }

            // 获取返程车票
            const returnResponse = await fetch(
                `http://localhost:5000/api/train/tickets?start=${preferences.endPoint}&end=${preferences.startPoint}&date=${preferences.endDate}`
            );
            const returnData = await returnResponse.json();
            if (returnData.success) {
                setReturnTickets(returnData.data.trains);
            }

            setPlanGenerated(true);
        } catch (error) {
            console.error('Error:', error);
            // TODO: 显示错误提示
        } finally {
            setTicketsLoading(false);
        }
    };

    const handleContinue = async () => {
        try {
            setTicketsLoading(true);
            setShowError(false);

            // 转换旅行风格
            const styleMap: { [key: string]: string } = {
                relaxed: '休闲',
                intensive: '密集',
                cultural: '文化',
                adventure: '探险'
            };

            // 转换住宿类型
            const accommodationMap: { [key: string]: string } = {
                hotel: '酒店',
                hostel: '青旅',
                apartment: '民宿',
                resort: '度假村'
            };

            const requestData = {
                departure: preferences.startPoint,
                destination: preferences.endPoint,
                start_date: preferences.startDate,
                end_date: preferences.endDate,
                travelers: {
                    adults: preferences.adultCount,
                    children: preferences.childCount
                },
                budget: preferences.budget,
                preferences: {
                    style: styleMap[preferences.travelStyle] || '休闲',
                    accommodation: accommodationMap[preferences.accommodationType] || '酒店'
                }
            };

            const response = await fetch('http://localhost:5000/api/travel/plan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            const data = await response.json();
            if (data.success) {
                setTravelPlan(data.data);
            } else {
                throw new Error(data.message || '生成旅行计划失败');
            }
        } catch (error) {
            console.error('Error:', error);
            setShowError(true);
        } finally {
            setTicketsLoading(false);
        }
    };

    return (
        <Layout>
            <MainContent>
                <Header>
                    <Typography variant="h4" gutterBottom>
                        智能出行规划助手
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 4 }}>
                        一键生成个性化旅游攻略，让您的旅行更轻松愉快
                    </Typography>
                </Header>

                <IntroSection>
                    <Typography variant="h5" gutterBottom>
                        关于智能出行规划
                    </Typography>
                    <Typography variant="body1" paragraph>
                        本智能体提供一键式旅游攻略生成，票务购买的方案。通过您提供的基本信息，结合您的偏好，实时天气情况，酒店情况，旅游景点情况，热点旅游线路自动为用户生成旅游计划和购票方案。
                    </Typography>
                </IntroSection>

                <Grid container spacing={4}>
                    {features.map((feature, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <FeatureCard>
                                <CardContent>
                                    <IconWrapper>
                                        {feature.icon}
                                    </IconWrapper>
                                    <Typography variant="h6" gutterBottom>
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {feature.description}
                                    </Typography>
                                </CardContent>
                            </FeatureCard>
                        </Grid>
                    ))}
                </Grid>

                <StartSection>
                    <Typography variant="h5" gutterBottom>
                        开始规划
                    </Typography>
                    <PreferenceForm>
                        <Grid container spacing={3}>
                            {/* 第一行：地点和日期 */}
                            <Grid item xs={12}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            required  // 添加必填标记
                                            fullWidth
                                            label="出发地"
                                            name="startPoint"
                                            value={preferences.startPoint}
                                            onChange={handleInputChange}
                                            error={preferences.startPoint.trim() === ''}  // 添加错误状态
                                            helperText={preferences.startPoint.trim() === '' ? '出发地不能为空' : ''}  // 添加错误提示
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            required  // 添加必填标记
                                            fullWidth
                                            label="目的地"
                                            name="endPoint"
                                            value={preferences.endPoint}
                                            onChange={handleInputChange}
                                            error={preferences.endPoint.trim() === ''}  // 添加错误状态
                                            helperText={preferences.endPoint.trim() === '' ? '目的地不能为空' : ''}  // 添加错误提示
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            fullWidth
                                            type="date"
                                            label="出发日期"
                                            name="startDate"
                                            value={preferences.startDate}
                                            onChange={handleInputChange}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            fullWidth
                                            type="date"
                                            label="返回日期"
                                            name="endDate"
                                            value={preferences.endDate}
                                            onChange={handleInputChange}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>

                            {/* 第二行：预算、人数和偏好 */}
                            <Grid item xs={12}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            label="预算（元）"
                                            name="budget"
                                            value={preferences.budget}
                                            onChange={handleInputChange}
                                            InputProps={{ inputProps: { min: 0 } }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <Grid container spacing={1}>
                                            <Grid item xs={6}>
                                                <TextField
                                                    fullWidth
                                                    type="number"
                                                    label="成人"
                                                    name="adultCount"
                                                    value={preferences.adultCount}
                                                    onChange={handleInputChange}
                                                    InputProps={{ inputProps: { min: 1 } }}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    fullWidth
                                                    type="number"
                                                    label="儿童"
                                                    name="childCount"
                                                    value={preferences.childCount}
                                                    onChange={handleInputChange}
                                                    InputProps={{ inputProps: { min: 0 } }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <FormControl fullWidth>
                                            <InputLabel>旅行风格</InputLabel>
                                            <Select
                                                name="travelStyle"
                                                value={preferences.travelStyle}
                                                onChange={handleSelectChange}
                                                label="旅行风格"
                                            >
                                                <MenuItem value="relaxed">轻松休闲</MenuItem>
                                                <MenuItem value="intensive">密集行程</MenuItem>
                                                <MenuItem value="cultural">文化体验</MenuItem>
                                                <MenuItem value="adventure">探险刺激</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <FormControl fullWidth>
                                            <InputLabel>住宿偏好</InputLabel>
                                            <Select
                                                name="accommodationType"
                                                value={preferences.accommodationType}
                                                onChange={handleSelectChange}
                                                label="住宿偏好"
                                            >
                                                <MenuItem value="hotel">酒店</MenuItem>
                                                <MenuItem value="hostel">青旅</MenuItem>
                                                <MenuItem value="apartment">民宿</MenuItem>
                                                <MenuItem value="resort">度假村</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Grid>

                            {/* 提交按钮 */}
                            <Grid item xs={12} sx={{ textAlign: 'center' }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={handleSubmit}
                                    disabled={planGenerated}
                                    sx={{ mt: 2, minWidth: 200 }}
                                >
                                    生成旅行计划
                                </Button>
                            </Grid>
                        </Grid>
                    </PreferenceForm>
                </StartSection>

                {/* 车票信息和继续按钮 */}
                {(outboundTickets.length > 0 || returnTickets.length > 0) && !ticketsLoading && (
                    <Box sx={{ mt: 4 }}>
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                                交通方案
                            </Typography>

                            {outboundTickets.length > 0 && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        去程车票
                                    </Typography>
                                    <TrainTicketList
                                        tickets={outboundTickets}
                                        onSelect={setSelectedOutboundTrainNo}
                                        selectedTrainNo={selectedOutboundTrainNo}
                                    />
                                </Box>
                            )}

                            {returnTickets.length > 0 && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        返程车票
                                    </Typography>
                                    <TrainTicketList
                                        tickets={returnTickets}
                                        onSelect={setSelectedReturnTrainNo}
                                        selectedTrainNo={selectedReturnTrainNo}
                                    />
                                </Box>
                            )}

                            <Box sx={{ textAlign: 'center', mt: 3 }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    color="secondary"
                                    onClick={handleContinue}
                                    sx={{ minWidth: 200 }}
                                >
                                    继续生成旅行计划
                                </Button>
                            </Box>
                        </Paper>
                    </Box>
                )}

                {/* Loading 状态 */}
                {ticketsLoading && (
                    <LoadingOverlay>
                        <Box sx={{ textAlign: 'center' }}>
                            <CircularProgress size={60} />
                            <Typography variant="h6" sx={{ mt: 2 }}>
                                正在生成旅行计划...
                            </Typography>
                        </Box>
                    </LoadingOverlay>
                )}

                {travelPlan && !ticketsLoading && (
                    <TravelPlanDisplay
                        plan={travelPlan}
                        selectedOutboundTicket={selectedOutboundTrainNo}
                        selectedReturnTicket={selectedReturnTrainNo}
                    />
                )}
            </MainContent>
        </Layout>
    );
};

const MainContent = styled('main')({
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
});

const Header = styled('div')({
    textAlign: 'center',
    marginBottom: '3rem',
});

const IntroSection = styled(Paper)({
    padding: '2rem',
    marginBottom: '3rem',
    backgroundColor: '#f8f9fa',
});

const FeatureCard = styled(Card)({
    height: '100%',
    transition: 'transform 0.2s',
    '&:hover': {
        transform: 'translateY(-4px)',
    },
});

const IconWrapper = styled('div')({
    color: '#1976d2',
    marginBottom: '1rem',
    display: 'flex',
    justifyContent: 'center',
});

const StartSection = styled(Paper)({
    padding: '2rem',
    marginTop: '3rem',
    textAlign: 'center',
    backgroundColor: '#f8f9fa',
});

const PreferenceForm = styled('div')({
    marginTop: '2rem',
    padding: '2rem',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
});

const LoadingOverlay = styled(Box)({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
});

export { }; 