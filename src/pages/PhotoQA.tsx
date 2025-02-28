import React, { useState } from 'react';
import { Layout } from '../components/layout';
import { Box, Typography, Paper, Grid, IconButton, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';

const PhotoQA: React.FC = () => {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [imageFileName, setImageFileName] = useState<string | null>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setUploadedImage(event.target?.result as string);
                setImageFileName(file.name);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setUploadedImage(event.target?.result as string);
                setImageFileName(file.name);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDeleteImage = () => {
        setUploadedImage(null);
        setResult(null);
        setErrorMessage(null);
        setImageFileName(null);
    };

    const handleGenerateAnswer = async () => {
        if (!uploadedImage) return;

        setIsLoading(true);
        const formData = new FormData();
        const blob = await fetch(uploadedImage!).then(r => r.blob());
        formData.append('image', blob, imageFileName || 'uploaded_image.jpg');

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/photo-qa`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (data.success) {
                setResult(data.data.answer);
            } else {
                console.error('生成答案失败:', data.message);
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
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <StyledPaper elevation={3} onDrop={handleDrop} onDragOver={handleDragOver}>
                            <Typography variant="h4" gutterBottom>
                                拍照答题
                            </Typography>
                            <Typography variant="body1" color="error" sx={{ mb: 4 }}>
                                千万不要用来做华为的性格测试题
                            </Typography>
                            {!uploadedImage ? (
                                <UploadBox>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        id="image-upload"
                                        onChange={handleImageUpload}
                                    />
                                    <label htmlFor="image-upload" style={{ width: '100%', height: '100%' }}>
                                        <Box sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: 3,
                                            height: '100%',
                                            justifyContent: 'center'
                                        }}>
                                            <CloudUploadIcon sx={{ fontSize: 60, color: 'primary.main' }} />
                                            <Typography variant="h6">
                                                点击或拖拽图片到此处上传
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                支持 JPG、PNG 格式
                                            </Typography>
                                        </Box>
                                    </label>
                                </UploadBox>
                            ) : (
                                <ImagePreviewBox>
                                    <img
                                        src={uploadedImage}
                                        alt="Uploaded"
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '400px',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <IconButton
                                        onClick={handleDeleteImage}
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 8,
                                            backgroundColor: 'white',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                            '&:hover': {
                                                backgroundColor: 'rgba(255, 0, 0, 0.1)',
                                            },
                                        }}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </ImagePreviewBox>
                            )}
                            {uploadedImage && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleGenerateAnswer}
                                    sx={{ mt: 2 }}
                                    disabled={isLoading}
                                >
                                    {isLoading ? '生成中...' : '生成答案'}
                                </Button>
                            )}
                            {errorMessage && (
                                <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                                    {errorMessage}
                                </Typography>
                            )}
                        </StyledPaper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <StyledPaper elevation={3}>
                            <Typography variant="h4" gutterBottom>
                                生成的答案
                            </Typography>
                            <Box sx={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {result ? (
                                    <Typography variant="h6">{result}</Typography>
                                ) : (
                                    <Typography variant="h6" color="textSecondary">
                                        上传图片后将在这里显示答案解析
                                    </Typography>
                                )}
                            </Box>
                        </StyledPaper>
                    </Grid>
                </Grid>
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
    height: '600px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
});

const UploadBox = styled(Box)({
    flex: 1,
    margin: '1rem',
    border: '2px dashed #ccc',
    borderRadius: '12px',
    textAlign: 'center',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    '&:hover': {
        borderColor: '#2196f3',
        backgroundColor: 'rgba(33, 150, 243, 0.04)',
    },
});

const ImagePreviewBox = styled(Box)({
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    padding: '1rem',
});

export default PhotoQA; 