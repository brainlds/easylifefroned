import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { HomePage } from './pages/home';
import ChatPage from './pages/chat';
import { PersonalityTests } from './pages/personality-tests';
import { LoginPage } from './pages/auth/login';
import { RegisterPage } from './pages/auth/register';
import { AuthProvider } from './contexts/auth-context';
import { DevTools } from './pages/dev-tools';
import { AIModels } from './pages/ai-models';
import { Divination } from './pages/divination';
import { Learning } from './pages/learning';
import { Entertainment } from './pages/entertainment';
import { Utils } from './pages/utils';
import { TestPage } from './pages/test';
import { Agents } from './pages/agents';
import { Workflow } from './pages/workflow';
import { CustomerService } from './pages/customer-service';
import { TravelPlanner } from './pages/travel-planner';
import PaymentPage from './pages/payment';
import PhotoQA from './pages/PhotoQA';
import BaziAnalysis from './pages/BaziAnalysis';
import Scripts from './pages/scripts';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#2D5CF6',
        },
        secondary: {
            main: '#4CAF50',
        },
        background: {
            default: '#F5F5F5',
        },
    },
    typography: {
        fontFamily: [
            'Inter',
            'PingFang SC',
            'sans-serif',
        ].join(','),
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                },
            },
        },
    },
});

function App() {
    console.log('API Base URL:', process.env.REACT_APP_API_URL);
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Navigate to="/home" />} />
                        <Route path="/home" element={<HomePage />} />
                        <Route path="/chat" element={<ChatPage />} />
                        <Route path="/personality-tests" element={<PersonalityTests />} />
                        <Route path="/dev-tools" element={<DevTools />} />
                        <Route path="/ai-models" element={<AIModels />} />
                        <Route path="/divination" element={<Divination />} />
                        <Route path="/learning" element={<Learning />} />
                        <Route path="/entertainment" element={<Entertainment />} />
                        <Route path="/utils" element={<Utils />} />
                        <Route path="/auth/login" element={<LoginPage />} />
                        <Route path="/auth/register" element={<RegisterPage />} />
                        <Route path="/tests" element={<TestPage />} />
                        <Route path="/agents" element={<Agents />} />
                        <Route path="/workflow" element={<Workflow />} />
                        <Route path="/customer-service" element={<CustomerService />} />
                        <Route path="/travel-planner" element={<TravelPlanner />} />
                        <Route path="/payment" element={<PaymentPage />} />
                        <Route path="/photo-qa" element={<PhotoQA />} />
                        <Route path="/bazi-analysis" element={<BaziAnalysis />} />
                        <Route path="/scripts" element={<Scripts />} />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App; 