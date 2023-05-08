// src/components/LoadingPage.js
import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const LoadingPage = () => {

    const style = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
    }
    return (
        <Box
            sx={style}
        >
            <Typography variant="h4" component="h1">
                Loading profile
            </Typography>
            <CircularProgress sx={{ margin: '1rem' }} />
        </Box>
    );
};

export default LoadingPage;
