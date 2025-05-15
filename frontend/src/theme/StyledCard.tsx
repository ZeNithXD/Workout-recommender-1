import React from 'react';
import { Card, CardContent, CardActions, Button, Box, Typography } from '@mui/material';

interface StyledCardProps {
  title: string;
  subtitle?: string;
  icon?: string;
  children?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  minHeight?: number;
}

const StyledCard: React.FC<StyledCardProps> = ({
  title,
  subtitle,
  icon,
  children,
  actionText,
  onAction,
  minHeight = 180,
}) => {
  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: 6,
        background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
        position: 'relative',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-8px) scale(1.03)',
          boxShadow: 12,
        },
        minHeight,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Accent Icon */}
      {icon && (
        <Box sx={{ position: 'absolute', top: 18, right: 18, fontSize: 36, opacity: 0.18 }}>
          {icon}
        </Box>
      )}
      <CardContent>
        <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 1 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography color="textSecondary" gutterBottom sx={{ fontWeight: 500, letterSpacing: 1, mb: 2 }}>
            {icon && `${icon} `}{subtitle}
          </Typography>
        )}
        {children}
      </CardContent>
      {actionText && onAction && (
        <CardActions sx={{ px: 2, pb: 2 }}>
          <Button
            size="medium"
            variant="contained"
            color="primary"
            sx={{
              borderRadius: 99,
              fontWeight: 600,
              boxShadow: 2,
              textTransform: 'none',
              letterSpacing: 1,
              px: 3,
              '&:hover': {
                background: 'linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)',
                color: '#fff',
              },
            }}
            onClick={onAction}
          >
            {actionText}
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default StyledCard; 