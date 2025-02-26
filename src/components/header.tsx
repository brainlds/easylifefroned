import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, InputBase, Menu, MenuItem, Fade } from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ToolCategory } from '../models/tool';

const categories: ToolCategory[] = [
    { id: 'all' as const, label: '全部工具' },
    { id: 'test', label: '测试工具', tags: ['热门工具'] },
    { id: 'dev', label: '开发工具', tags: ['最新上线'] },
    { id: 'entertainment', label: '娱乐', tags: ['新增'] },
    { id: 'utils', label: '实用工具', tags: ['热门'] },
    { id: 'crypto', label: '加密解密' },
    { id: 'divination', label: '命理学', tags: ['新增'] },
];

/**
 * 头部导航组件
 * @returns 渲染的头部导航栏
 */
export const Header: React.FC = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedCategory, setSelectedCategory] = useState('all');

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCategorySelect = (categoryId: string) => {
        setSelectedCategory(categoryId);
        setAnchorEl(null);
    };

    return (
        <AppBar position="sticky">
            <StyledToolbar>
                <Logo>工具集</Logo>
                <Navigation>
                    <NavButton
                        aria-haspopup="true"
                        onClick={handleMenuOpen}
                        endIcon={<ExpandMoreIcon />}
                    >
                        {categories.find(c => c.id === selectedCategory)?.label}
                    </NavButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={() => setAnchorEl(null)}
                        TransitionComponent={Fade}
                    >
                        {categories.map((category) => (
                            <MenuItem
                                key={category.id}
                                onClick={() => handleCategorySelect(category.id)}
                                selected={category.id === selectedCategory}
                            >
                                <CategoryItem>
                                    {category.label}
                                    {category.tags?.map(tag => (
                                        <Tag key={tag}>{tag}</Tag>
                                    ))}
                                </CategoryItem>
                            </MenuItem>
                        ))}
                    </Menu>
                </Navigation>
                <Search>
                    <SearchIconWrapper>
                        <SearchIcon />
                    </SearchIconWrapper>
                    <SearchInput placeholder="搜索工具..." />
                </Search>
            </StyledToolbar>
        </AppBar>
    );
};

const StyledToolbar = styled(Toolbar)({
    justifyContent: 'space-between',
});

const Logo = styled(Typography)({
    fontSize: '1.5rem',
    fontWeight: 'bold',
});

const Navigation = styled('div')({
    display: 'flex',
    gap: '1rem',
});

const NavButton = styled(Button)({
    textTransform: 'none',
});

const Search = styled('div')({
    position: 'relative',
    borderRadius: '4px',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
    },
    width: '300px',
});

const SearchIconWrapper = styled('div')({
    position: 'absolute',
    padding: '0 8px',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
});

const SearchInput = styled(InputBase)({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: '8px 8px 8px 40px',
    },
});

const Tag = styled('span')(({ theme }) => ({
    fontSize: '0.75rem',
    marginLeft: '8px',
    padding: '2px 6px',
    backgroundColor: theme.palette.primary.light,
    borderRadius: '4px',
}));

const CategoryItem = styled('div')({
    display: 'flex',
    alignItems: 'center',
}); 