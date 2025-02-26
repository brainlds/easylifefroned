import React from 'react';
import { Typography, Link, Container } from '@mui/material';
import { styled } from '@mui/material/styles';

/**
 * 底部组件
 * @returns 渲染的底部区域
 */
export const Footer: React.FC = () => {
    return (
        <FooterContainer>
            <Container>
                <FooterContent>
                    <FooterLinks>
                        <Link href="#" color="inherit">关于我们</Link>
                        <Link href="#" color="inherit">使用条款</Link>
                        <Link href="#" color="inherit">隐私政策</Link>
                    </FooterLinks>
                    <Copyright>
                        © {new Date().getFullYear()} 工具集. 保留所有权利.
                    </Copyright>
                </FooterContent>
            </Container>
        </FooterContainer>
    );
};

const FooterContainer = styled('footer')({
    backgroundColor: '#f5f5f5',
    padding: '2rem 0',
    marginTop: 'auto',
});

const FooterContent = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
});

const FooterLinks = styled('div')({
    display: 'flex',
    gap: '2rem',
});

const Copyright = styled(Typography)({
    color: '#666',
}); 