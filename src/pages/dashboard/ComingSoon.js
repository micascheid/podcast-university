import { react } from 'react';
import Box from "@mui/material/Box";
import {Stack, Typography} from "@mui/material";
import MainCard from "../../components/MainCard";

const ComingSoon = () => {


    return (
        <MainCard>
            <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                <Typography variant="h5" component="span">
                    Custom Note Request:
                </Typography>
                <Typography variant="body1" component="span">
                    {' '}
                    Below you will be able to ask what information you would like back from the podcast.
                </Typography>
            </Box>

            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                width="100%"
                minHeight="100px"
                border="1px solid #ccc"
                bgcolor="rgba(0, 0, 0, 0.1)"
            >
                <Typography variant="h2" color="text.secondary">
                    Coming Soon
                </Typography>
            </Box>
        </MainCard>
    );
};

export default ComingSoon;