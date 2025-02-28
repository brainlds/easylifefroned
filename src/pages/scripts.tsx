import React, { useEffect, useState } from 'react';
import { Layout } from '../components/layout';
import {
    Box,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    ListItemSecondaryAction,
    IconButton,
    Chip,
    Tooltip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CodeIcon from '@mui/icons-material/Code';
import DownloadIcon from '@mui/icons-material/Download';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DataUsageIcon from '@mui/icons-material/DataUsage';

interface ScriptFile {
    prefix: string;
    modified_time: number;
    size: number;
}

interface ScriptResponse {
    code: number;
    success: boolean;
    data: {
        files: ScriptFile[];
        total: number;
    };
}

const Scripts: React.FC = () => {
    const [scripts, setScripts] = useState<ScriptFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchScripts = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/scripts`);
                const data: ScriptResponse = await response.json();

                if (data.success) {
                    setScripts(data.data.files);
                } else {
                    setError('获取脚本列表失败');
                }
            } catch (err) {
                setError('网络请求失败');
                console.error('Error fetching scripts:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchScripts();
    }, []);

    const formatFileSize = (size: number): string => {
        if (size < 1024) return `${size} B`;
        if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
        return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    };

    const formatModifiedTime = (timestamp: number): string => {
        return new Date(timestamp * 1000).toLocaleString();
    };

    const handleDownload = async (scriptName: string) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/scripts/download/${scriptName}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/octet-stream',
                },
            });

            if (!response.ok) {
                // 处理错误响应
                const errorData = await response.json();
                throw new Error(errorData.error || '下载失败');
            }

            // 从 Content-Disposition 头中获取文件名
            const contentDisposition = response.headers.get('Content-Disposition');
            let filename = scriptName;
            if (contentDisposition) {
                const matches = /filename=(.+)/.exec(contentDisposition);
                if (matches && matches[1]) {
                    filename = decodeURIComponent(matches[1]);
                }
            }

            // 创建 Blob 对象并下载
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            // 可以添加下载成功的提示
            console.log('下载成功:', filename);
        } catch (error) {
            console.error('下载失败:', error);
            setError(error instanceof Error ? error.message : '下载失败');
        }
    };

    return (
        <Layout>
            <Container>
                <Header>
                    <Typography variant="h4" gutterBottom>
                        脚本列表
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        可用的自动化脚本列表，点击下载按钮获取脚本
                    </Typography>
                </Header>

                <StyledPaper elevation={3}>
                    {loading ? (
                        <Typography>加载中...</Typography>
                    ) : error ? (
                        <Typography color="error">{error}</Typography>
                    ) : (
                        <List>
                            {scripts.map((script) => (
                                <StyledListItem key={script.prefix} divider>
                                    <ListItemIcon>
                                        <CodeIcon color="primary" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={script.prefix}
                                        secondary={
                                            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <AccessTimeIcon fontSize="small" color="action" />
                                                    <Typography variant="body2" color="textSecondary">
                                                        {formatModifiedTime(script.modified_time)}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <DataUsageIcon fontSize="small" color="action" />
                                                    <Typography variant="body2" color="textSecondary">
                                                        {formatFileSize(script.size)}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        }
                                    />
                                    <ListItemSecondaryAction>
                                        <Tooltip title="下载脚本">
                                            <IconButton
                                                edge="end"
                                                onClick={() => handleDownload(script.prefix)}
                                            >
                                                <DownloadIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </ListItemSecondaryAction>
                                </StyledListItem>
                            ))}
                        </List>
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

const Header = styled('div')({
    textAlign: 'center',
    marginBottom: '2rem',
});

const StyledPaper = styled(Paper)({
    borderRadius: '12px',
    overflow: 'hidden',
});

const StyledListItem = styled(ListItem)({
    padding: '1rem',
    '&:hover': {
        backgroundColor: '#f5f5f5',
    },
});

export default Scripts;

export { }; 