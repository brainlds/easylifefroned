import React, { useState } from 'react';
import { Box, Paper, Typography, Card, CardContent, CardMedia, Divider, Chip, Button, Snackbar, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import { TravelPlan, DailyPlan, Activity } from '../types/travel-plan';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CloudIcon from '@mui/icons-material/Cloud';
import UmbrellaIcon from '@mui/icons-material/Umbrella';
import { useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

interface TravelPlanDisplayProps {
    plan: TravelPlan;
    selectedOutboundTicket?: string;
    selectedReturnTicket?: string;
}

// 更新 mockImages 数据
const mockImages: Record<string, string> = {
    '外滩': 'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2',
    '上海博物馆': 'https://images.unsplash.com/photo-1552334823-ca7f70c89316',
    '豫园': 'https://images.unsplash.com/photo-1548013146-72479768bada',
    '田子坊': 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc',
    '民宿': 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
    '酒店': 'https://images.unsplash.com/photo-1582719508461-905c673771fd',
} as const;

// 创建一个类型守卫函数来检查 key 是否存在于 mockImages 中
const hasImage = (key: string): key is keyof typeof mockImages => {
    return key in mockImages;
};

interface SpotSelectionProps {
    activity: Activity;
    isSelected: boolean;
    onSelect: () => void;
}

const SpotSelection: React.FC<SpotSelectionProps> = ({ activity, isSelected, onSelect }) => {
    // 只显示景点和住宿的卡片
    if (activity.cost === 0 ||
        (activity.activity_type !== '景点' && activity.activity_type !== '住宿')) {
        return null;
    }

    const getImage = () => {
        if (activity.activity_type === '住宿') {
            return mockImages['民宿'];
        }
        return mockImages[activity.name] || 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29';
    };

    return (
        <SpotCard
            onClick={onSelect}
            selected={isSelected}
        >
            <CardMedia
                component="img"
                height="160"
                image={getImage()}
                alt={activity.name}
            />
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6">{activity.name}</Typography>
                    <Chip
                        label={`¥${activity.cost}`}
                        color={isSelected ? "success" : "primary"}
                    />
                </Box>
                <Typography variant="body2" color="text.secondary">
                    {activity.description}
                </Typography>
            </CardContent>
        </SpotCard>
    );
};

export const TravelPlanDisplay: React.FC<TravelPlanDisplayProps> = ({
    plan,
    selectedOutboundTicket,
    selectedReturnTicket
}) => {
    const navigate = useNavigate();
    const [selectedSpots, setSelectedSpots] = useState<Set<string>>(new Set());
    const [showError, setShowError] = useState(false);

    // 初始化时默认选中所有景点和住宿
    React.useEffect(() => {
        const allSpots = plan.daily_plans
            .flatMap(day => day.activities)
            .filter(activity =>
                (activity.activity_type === '景点' || activity.activity_type === '住宿')
            )
            .map(activity => activity.name);

        setSelectedSpots(new Set(allSpots));
    }, [plan]);

    const handleSpotSelect = (activityName: string) => {
        setSelectedSpots(prev => {
            const newSet = new Set(prev);
            if (newSet.has(activityName)) {
                newSet.delete(activityName);
            } else {
                newSet.add(activityName);
            }
            return newSet;
        });
    };

    const handleCloseError = () => {
        setShowError(false);
    };

    const handlePurchase = async () => {
        if (!selectedOutboundTicket || !selectedReturnTicket) {
            setShowError(true);
            return;
        }

        try {
            // 准备请求数据
            const purchaseData = {
                tickets: {
                    outbound: selectedOutboundTicket,
                    return: selectedReturnTicket
                },
                activities: plan.daily_plans
                    .flatMap(day => day.activities)
                    .filter(activity =>
                        (activity.activity_type === '景点' || activity.activity_type === '住宿') &&
                        selectedSpots.has(activity.name)
                    )
                    .map(activity => ({
                        name: activity.name,
                        type: activity.activity_type,
                        cost: activity.cost,
                        date: plan.daily_plans.find(day =>
                            day.activities.some(a => a.name === activity.name)
                        )?.date
                    })),
                totalCost: plan.total_cost
            };

            // 发送购买请求到后端
            const response = await fetch('http://localhost:5000/api/travel/purchase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(purchaseData)
            });

            const data = await response.json();

            if (data.success) {
                // 跳转到支付页面，带上订单信息
                navigate('/payment', {
                    state: {
                        orderId: data.orderId,
                        purchaseData,
                        plan
                    }
                });
            } else {
                throw new Error(data.message || '创建订单失败');
            }
        } catch (error) {
            console.error('Purchase error:', error);
            // 显示错误提示
            setShowError(true);
        }
    };

    const getWeatherIcon = (weather: string) => {
        switch (weather) {
            case '晴朗':
                return <WbSunnyIcon />;
            case '多云':
                return <CloudIcon />;
            case '小雨':
                return <UmbrellaIcon />;
            default:
                return <WbSunnyIcon />;
        }
    };

    const renderActivity = (activity: Activity) => (
        <ActivityCard key={activity.name}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">{activity.name}</Typography>
                    <Chip label={`¥${activity.cost}`} color="primary" />
                </Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                    {activity.time}
                </Typography>
                <Typography variant="body1" paragraph>
                    {activity.description}
                </Typography>
                <Typography variant="body2" color="primary">
                    {activity.weather_notice}
                </Typography>
                {hasImage(activity.name) && (
                    <CardMedia
                        component="img"
                        height="200"
                        image={mockImages[activity.name]}
                        alt={activity.name}
                        sx={{ mt: 2, borderRadius: 1 }}
                    />
                )}
            </CardContent>
        </ActivityCard>
    );

    const renderDailyPlan = (dailyPlan: DailyPlan, index: number) => {
        const paidActivities = dailyPlan.activities.filter(activity =>
            activity.cost > 0 &&
            (activity.activity_type === '景点' || activity.activity_type === '住宿')
        );

        return (
            <DayCard key={dailyPlan.date}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5">
                            Day {index + 1} - {new Date(dailyPlan.date).toLocaleDateString()}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {getWeatherIcon(dailyPlan.weather)}
                            <Typography>{dailyPlan.weather}</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {dailyPlan.activities.map(renderActivity)}
                    </Box>

                    {paidActivities.length > 0 && (
                        <>
                            <Divider sx={{ my: 3 }} />
                            <Typography variant="h6" gutterBottom>
                                今日景点/住宿推荐
                            </Typography>
                            <Box sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                gap: 2,
                                mt: 2
                            }}>
                                {paidActivities.map(activity => (
                                    <SpotSelection
                                        key={activity.name}
                                        activity={activity}
                                        isSelected={selectedSpots.has(activity.name)}
                                        onSelect={() => handleSpotSelect(activity.name)}
                                    />
                                ))}
                            </Box>
                        </>
                    )}

                    <Box sx={{ mt: 2, textAlign: 'right' }}>
                        <Typography variant="h6">
                            当日总花费: ¥{dailyPlan.daily_cost}
                        </Typography>
                    </Box>
                </CardContent>
            </DayCard>
        );
    };

    return (
        <Container>
            <SummaryCard>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        旅行概览
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                        {plan.summary}
                    </Typography>
                </CardContent>
            </SummaryCard>

            <Box sx={{ my: 4 }}>
                {plan.daily_plans.map((dailyPlan, index) => renderDailyPlan(dailyPlan, index))}
            </Box>

            <TotalCard>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        费用统计
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography>预算</Typography>
                        <Typography>¥{plan.budget}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography>实际花费</Typography>
                        <Typography>¥{plan.total_cost}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                        <Typography>节省金额</Typography>
                        <Typography>¥{plan.budget - plan.total_cost}</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={handlePurchase}
                            startIcon={<ShoppingCartIcon />}
                            sx={{
                                minWidth: 200,
                                py: 1.5,
                                fontSize: '1.1rem'
                            }}
                        >
                            一键购买
                        </Button>
                    </Box>
                </CardContent>
            </TotalCard>

            <Snackbar
                open={showError}
                autoHideDuration={3000}
                onClose={handleCloseError}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseError}
                    severity="warning"
                    variant="filled"
                    sx={{
                        width: '100%',
                        fontSize: '1rem',
                        '& .MuiAlert-icon': {
                            fontSize: '2rem'
                        }
                    }}
                >
                    请先选择去程和返程车票
                </Alert>
            </Snackbar>

            <style>
                {`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(-10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}
            </style>
        </Container>
    );
};

const Container = styled(Box)({
    marginTop: '2rem',
});

const SummaryCard = styled(Card)({
    marginBottom: '2rem',
    backgroundColor: '#f8f9fa',
});

const DayCard = styled(Card)({
    marginBottom: '2rem',
});

const ActivityCard = styled(Card)({
    marginBottom: '1rem',
    '&:last-child': {
        marginBottom: 0,
    },
});

const TotalCard = styled(Card)({
    backgroundColor: '#f8f9fa',
});

const SpotCard = styled(Card)<{ selected?: boolean }>(({ theme, selected }) => ({
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: selected ? `2px solid ${theme.palette.success.main}` : '2px solid transparent',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[4],
    },
}));

export { }; 