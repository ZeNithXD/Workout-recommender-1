import React from 'react';
import { Box, Container } from '@mui/material';
import Fade from '@mui/material/Fade';

interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, title }) => {
  return (
    <Box sx={{
      minHeight: '100vh',
      width: '100%',
      background: 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
      py: 6,
    }}>
      <Container maxWidth="lg" sx={{ mt: 0 }}>
        <Fade in timeout={500}>
          <div>{children}</div>
        </Fade>
      </Container>
    </Box>
  );
};

export default PageContainer; 