import React, { useState } from 'react';
import { Paper, TextField, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

/**
 * 工具操作界面组件
 * @returns 渲染的工具操作界面
 */
export const ToolInterface: React.FC = () => {
    const [input, setInput] = useState<string>('');
    const [result, setResult] = useState<string>('');

    const handleProcess = (): void => {
        // 处理逻辑
        setResult(`处理结果: ${input}`);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setInput(e.target.value);
    };

    return (
        <ToolContainer>
            <InputSection>
                <StyledTextField
                    multiline
                    rows={4}
                    placeholder="请输入内容..."
                    value={input}
                    onChange={handleChange}
                />
                <ProcessButton
                    variant="contained"
                    onClick={handleProcess}
                    disabled={!input}
                >
                    处理
                </ProcessButton>
            </InputSection>
            {result && (
                <ResultSection>
                    <ResultTitle>结果</ResultTitle>
                    <ResultContent>{result}</ResultContent>
                </ResultSection>
            )}
        </ToolContainer>
    );
};

const ToolContainer = styled(Paper)({
    padding: '2rem',
    maxWidth: '800px',
    margin: '0 auto',
});

const InputSection = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
});

const StyledTextField = styled(TextField)({
    width: '100%',
});

const ProcessButton = styled(Button)({
    alignSelf: 'flex-end',
});

const ResultSection = styled('div')({
    marginTop: '2rem',
    padding: '1rem',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
});

const ResultTitle = styled(Typography)({
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
});

const ResultContent = styled(Typography)({
    whiteSpace: 'pre-wrap',
}); 