import { react } from 'react';
import MainCard from "../../components/MainCard";
import Box from "@mui/material/Box";
import {List, ListItem, ListItemText, Stack, Typography} from "@mui/material";
import {Link} from "react-router-dom";


const SiteIssue = () => {
    const styleNonReg = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    }

    return (
        <MainCard sx={styleNonReg}>
            <Box>
                <Typography variant="h4" align="center">
                    Please check the following
                </Typography>
                <Stack spacing={1}>
                    <Typography variant="body1">
                        <Box component="span" display="inline-block" width={24}>1.) </Box>
                        This site requires the use of cookies in order to monitor how we build notes tailored specifically for you. Please enable cookies for this site to run.
                    </Typography>
                    <Typography variant="body1">
                        <Box component="span" display="inline-block" width={24}>2.)</Box>
                        After enabling cookies please refresh this
                    </Typography>
                    <Typography variant="body1">
                        <Box component="span" display="inline-block" width={24}>3.)</Box>
                        If troubles persist please send an email to: podcastuniversity.ml@gmail.com and we will get you squared away ASAP!
                    </Typography>
                </Stack>
            </Box>
        </MainCard>
    );

};

export default SiteIssue;