import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  useTheme,
  IconButton,
  Skeleton
} from '@mui/material';
import {
  LocalOffer,
  FlashOn,
  ArrowBack,
  ArrowForward
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TrendingBanner = ({ banners = [] }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (banners.length > 0) {
      setLoading(false);
    }
  }, [banners]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (banners.length > 0) {
        setCurrentBanner((prev) => (prev + 1) % banners.length);
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const handleNext = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  const handlePrev = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  if (loading) {
    return (
      <Box sx={{ height: '400px', bgcolor: '#f1f5f9', borderRadius: '0' }}>
        <Skeleton variant="rectangular" width="100%" height="100%" />
      </Box>
    );
  }

  if (banners.length === 0) {
    // Default banner if no banners from API
    return (
      <Paper
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '0',
          p: { xs: 4, md: 8 },
          color: 'white',
          overflow: 'hidden',
          position: 'relative',
          height: '400px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            animation: 'pulse 3s infinite'
          }}
        />
        <Container maxWidth="xl">
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={7}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <FlashOn sx={{ fontSize: 48 }} />
                  <Typography variant="h2" fontWeight="800">
                    Mega Sale!
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ mb: 2, opacity: 0.9, fontWeight: 600 }}>
                  Up to 50% Off
                </Typography>
                <Typography variant="h5" sx={{ mb: 3, opacity: 0.8 }}>
                  On all skincare products • Limited time offer
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/products?hasDiscount=true')}
                  sx={{
                    bgcolor: 'white',
                    color: theme.palette.primary.main,
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    py: 1.5,
                    px: 4,
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.9)',
                      transform: 'scale(1.05)'
                    },
                    transition: '0.3s'
                  }}
                >
                  Shop Now
                </Button>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h1" fontWeight="800" sx={{ fontSize: { xs: '4rem', md: '6rem' } }}>
                  50% OFF
                </Typography>
                <Typography variant="h5">Use code: SUMMER50</Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Paper>
    );
  }

  return (
    <Box sx={{ position: 'relative', height: '400px', overflow: 'hidden' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentBanner}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{ height: '100%' }}
        >
          <Paper
            sx={{
              background: banners[currentBanner]?.backgroundColor || 
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundImage: banners[currentBanner]?.backgroundImage ? 
                `url(${banners[currentBanner].backgroundImage})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '0',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              position: 'relative'
            }}
          >
            <Container maxWidth="xl">
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={7}>
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Typography 
                      variant="h2" 
                      fontWeight="800" 
                      sx={{ 
                        color: banners[currentBanner]?.textColor || 'white',
                        mb: 2 
                      }}
                    >
                      {banners[currentBanner]?.title || 'Special Offer'}
                    </Typography>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        mb: 3, 
                        color: banners[currentBanner]?.textColor || 'white',
                        opacity: 0.9 
                      }}
                    >
                      {banners[currentBanner]?.subtitle || 'Limited time deal'}
                    </Typography>
                    {banners[currentBanner]?.buttonText && (
                      <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate(banners[currentBanner].buttonLink || '/products')}
                        sx={{
                          bgcolor: 'white',
                          color: theme.palette.primary.main,
                          fontWeight: 700,
                          fontSize: '1.1rem',
                          py: 1.5,
                          px: 4,
                          '&:hover': {
                            bgcolor: 'rgba(255,255,255,0.9)',
                            transform: 'scale(1.05)'
                          },
                          transition: '0.3s'
                        }}
                      >
                        {banners[currentBanner].buttonText}
                      </Button>
                    )}
                  </motion.div>
                </Grid>
                {banners[currentBanner]?.image && (
                  <Grid item xs={12} md={5}>
                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <Box
                        component="img"
                        src={banners[currentBanner].image}
                        alt={banners[currentBanner].title}
                        sx={{
                          width: '100%',
                          maxHeight: '300px',
                          objectFit: 'contain'
                        }}
                      />
                    </motion.div>
                  </Grid>
                )}
              </Grid>
            </Container>
          </Paper>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <IconButton
            onClick={handlePrev}
            sx={{
              position: 'absolute',
              left: 20,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(255,255,255,0.3)',
              backdropFilter: 'blur(4px)',
              color: 'white',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.5)' },
              zIndex: 2
            }}
          >
            <ArrowBack />
          </IconButton>
          <IconButton
            onClick={handleNext}
            sx={{
              position: 'absolute',
              right: 20,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(255,255,255,0.3)',
              backdropFilter: 'blur(4px)',
              color: 'white',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.5)' },
              zIndex: 2
            }}
          >
            <ArrowForward />
          </IconButton>
        </>
      )}

      {/* Dots Indicator */}
      {banners.length > 1 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 1,
            zIndex: 2
          }}
        >
          {banners.map((_, index) => (
            <Box
              key={index}
              onClick={() => setCurrentBanner(index)}
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: index === currentBanner ? 'white' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                transition: '0.3s',
                '&:hover': {
                  bgcolor: 'white',
                  transform: 'scale(1.2)'
                }
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};
export default TrendingBanner;