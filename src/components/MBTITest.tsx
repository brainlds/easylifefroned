import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    LinearProgress,
    styled
} from '@mui/material';

export interface MBTIQuestion {
    id: number;
    content: string;
    option_a: string;
    option_b: string;
    dimension_a: string;
    dimension_b: string;
}

export interface MBTITestProps {
    questions: MBTIQuestion[];
    onComplete: (answers: Array<{ questionId: number, answer: 'A' | 'B' }>) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

const TestContainer = styled(Card)({
    maxWidth: 600,
    margin: '2rem auto',
    padding: '2rem',
});

const ProgressBar = styled(LinearProgress)({
    marginBottom: '2rem',
    height: 10,
    borderRadius: 5,
});

const OptionButton = styled(FormControlLabel)({
    width: '100%',
    margin: '0.5rem 0',
    padding: '1rem',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    '&:hover': {
        backgroundColor: '#f5f5f5',
    },
});

const MBTITest: React.FC<MBTITestProps> = ({ questions, onComplete, onCancel, isSubmitting = false }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Array<{ questionId: number, answer: 'A' | 'B' }>>([]);
    const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(null);

    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    const handleOptionSelect = (value: 'A' | 'B') => {
        setSelectedOption(value);
    };

    const handleNext = () => {
        if (selectedOption) {
            const newAnswer = {
                questionId: currentQuestion.id,
                answer: selectedOption
            };

            const newAnswers = [...answers, newAnswer];
            setAnswers(newAnswers);

            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
                setSelectedOption(null);
            } else {
                onComplete(newAnswers);
            }
        }
    };

    return (
        <TestContainer>
            <ProgressBar variant="determinate" value={progress} />

            <Typography variant="h6" gutterBottom>
                问题 {currentQuestionIndex + 1}/{questions.length}
            </Typography>

            <Typography variant="h5" gutterBottom>
                {currentQuestion.content}
            </Typography>

            <FormControl component="fieldset" fullWidth>
                <RadioGroup
                    value={selectedOption || ''}
                    onChange={(e) => handleOptionSelect(e.target.value as 'A' | 'B')}
                >
                    <OptionButton
                        value="A"
                        control={<Radio />}
                        label={currentQuestion.option_a}
                    />
                    <OptionButton
                        value="B"
                        control={<Radio />}
                        label={currentQuestion.option_b}
                    />
                </RadioGroup>
            </FormControl>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                <Button
                    variant="outlined"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    取消测试
                </Button>
                <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={!selectedOption || isSubmitting}
                >
                    {currentQuestionIndex === questions.length - 1 ? (
                        isSubmitting ? '提交中...' : '完成'
                    ) : '下一题'}
                </Button>
            </Box>
        </TestContainer>
    );
};

export default MBTITest; 