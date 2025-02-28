import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout';
import MBTITest from '../components/MBTITest';
import { CircularProgress, Box, Typography } from '@mui/material';
import { TestReport } from '../components/TestReport';

interface TestResponse {
    code: number;
    success: boolean;
    data: {
        file_id: string;
        questions: Array<{
            id: number;
            content: string;
            option_a: string;
            option_b: string;
            dimension_a: string;
            dimension_b: string;
        }>;
        test_type: string;
        total: number;
    };
}

interface ReportData {
    analysis?: string;
    file_id?: string;
    test_type?: string;
}

export const TestPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [testData, setTestData] = useState<TestResponse['data'] | null>(null);
    const testType = searchParams.get('type');
    const [reportLoading, setReportLoading] = useState(false);
    const [reportData, setReportData] = useState<ReportData | null>(null);
    const [submitError, setSubmitError] = useState(false);
    const [key, setKey] = useState(0);

    useEffect(() => {
        const loadTest = async () => {
            if (!testType) return;

            try {
                setLoading(true);
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/test?type=${testType}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();
                if (data.success) {
                    setTestData(data.data);
                } else {
                    throw new Error(data.error || '获取测试题目失败');
                }
            } catch (error) {
                console.error('Error:', error);
                // 可以添加错误提示
            } finally {
                setLoading(false);
            }
        };

        loadTest();
    }, [testType]);

    const handleTestComplete = async (answers: Array<{ questionId: number, answer: 'A' | 'B' }>) => {
        try {
            setReportLoading(true);
            setSubmitError(false);

            // 使用 Set 来确保每个 questionId 只出现一次
            const uniqueAnswers = Array.from(new Map(answers.map(answer => [answer.questionId, answer])).values());

            // 构建符合要求的请求数据
            const requestData = {
                test_type: testType,
                file_id: testData?.file_id || '', // 从测试数据中获取 file_id
                answers: uniqueAnswers.map(answer => ({
                    questionId: answer.questionId,
                    answer: answer.answer
                }))
            };

            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/test/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            const data = await response.json();
            if (data.success) {
                setReportData(data.data);
            } else {
                console.error('提交测试失败:', data.error);
                setSubmitError(true);
            }
        } catch (error) {
            console.error('提交测试失败:', error);
            setSubmitError(true);
        } finally {
            setReportLoading(false);
        }
    };

    const resetTest = () => {
        setReportData(null);
        setKey(prev => prev + 1);
    };

    const handleRetry = () => {
        setSubmitError(false);
        setReportData(null);
    };

    if (loading) {
        return (
            <Layout>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                    <CircularProgress />
                </Box>
            </Layout>
        );
    }

    if (!testData || !testType) {
        return (
            <Layout>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                    <Typography color="error">
                        无法加载测试题目，请稍后重试
                    </Typography>
                </Box>
            </Layout>
        );
    }

    return (
        <Layout>
            <MBTITest
                key={key}
                questions={testData.questions}
                onComplete={handleTestComplete}
                onCancel={() => navigate('/personality-tests')}
                isSubmitting={reportLoading}
            />
            <TestReport
                analysis={reportData?.analysis}
                loading={reportLoading}
                testType={testType}
                error={submitError}
                onRetry={handleRetry}
                onRetest={resetTest}
            />
        </Layout>
    );
}; 