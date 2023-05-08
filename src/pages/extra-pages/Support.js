// material-ui
import {Divider, Stack, Typography} from '@mui/material';

// project import
import MainCard from '../../components/MainCard';

// ==============================|| SAMPLE PAGE ||============================== //

const Support = () => (
    <MainCard title="Support">
        <Stack direction={"row"} spacing={2}>
            <Typography variant="h6">
                Email:
            </Typography>
            <Typography variant="h6">
                podcastuniversity.ml@gmail.com
            </Typography>
        </Stack>
        <Stack direction={"row"} spacing={2}>
            <Typography variant="h6">
                Twitter:
            </Typography>
            <Typography variant="h6">
                @micalinscheid
            </Typography>
        </Stack>
        <Divider sx={{width: '100%'}}/>
    </MainCard>
);

export default Support;
