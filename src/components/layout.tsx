import React, { ReactNode, useState } from 'react';
import { Footer } from './footer';
import { styled } from '@mui/material/styles';
import { AdBanner } from './ad-banner';
import { Grid, Typography, Button, TextField, InputAdornment } from '@mui/material';
import { useAuth } from '../contexts/auth-context';
import SearchIcon from '@mui/icons-material/Search';

/**
 * 布局组件属性
 */
interface LayoutProps {
    children: ReactNode;
}

/**
 * 页面布局组件
 * @param props - 组件属性
 * @returns 渲染的布局结构
 */
export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { user, logout } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
        // TODO: 实现搜索逻辑
    };

    return (
        <LayoutContainer>
            <StyledHeader>
                <StyledLogo>
                    集成工具箱
                </StyledLogo>
                <SearchContainer>
                    <SearchField
                        placeholder="搜索工具..."
                        value={searchQuery}
                        onChange={handleSearch}
                        variant="outlined"
                        size="small"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />
                </SearchContainer>
                <UserInfo>
                    {user && (
                        <>
                            <Typography variant="body1">
                                {user.username} {user.isGuest && '(游客)'}
                            </Typography>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={logout}
                                sx={{ ml: 2 }}
                            >
                                退出
                            </Button>
                        </>
                    )}
                </UserInfo>
            </StyledHeader>
            <ContentContainer container>
                <MainContent item xs={12} md={9}>
                    {children}
                </MainContent>
                <Sidebar item md={3}>
                    <AdBanner />
                    <AdBanner />
                </Sidebar>
            </ContentContainer>
            <Footer />
        </LayoutContainer>
    );
};

const LayoutContainer = styled('div')({
    minHeight: '150vh',
    display: 'flex',
    flexDirection: 'column',
});

const StyledHeader = styled('header')({
    padding: '1.5rem 2rem',
    backgroundColor: '#fff',
    borderBottom: '1px solid #e0e0e0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
});

const StyledLogo = styled('div')({
    fontSize: '1.75rem',
    fontWeight: 'bold',
    color: '#2D5CF6',
    letterSpacing: '0.5px',
    textTransform: 'none',
    position: 'relative',
    '&:hover': {
        transform: 'scale(1.02)',
        transition: 'transform 0.2s ease',
    },
});

const ContentContainer = styled(Grid)({
    flex: 1,
    minHeight: 'calc(150vh - 80px - 100px)',
});

const MainContent = styled(Grid)({
    padding: '3rem',
});

const Sidebar = styled(Grid)(({ theme }) => ({
    backgroundColor: theme.palette.grey[50],
    borderLeft: `1px solid ${theme.palette.divider}`,
    padding: '3rem',
    minHeight: '100%',
}));

const UserInfo = styled('div')({
    display: 'flex',
    alignItems: 'center',
});

const SearchContainer = styled('div')({
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    padding: '0 2rem',
});

const SearchField = styled(TextField)({
    width: '100%',
    maxWidth: '400px',
    '& .MuiOutlinedInput-root': {
        borderRadius: '20px',
        backgroundColor: '#f5f5f5',
        '&:hover': {
            backgroundColor: '#f0f0f0',
        },
        '&.Mui-focused': {
            backgroundColor: '#fff',
        },
    },
    '& .MuiOutlinedInput-input': {
        padding: '8px 14px',
    },
}); 