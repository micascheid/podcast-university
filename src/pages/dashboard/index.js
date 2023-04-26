import { React } from 'react';
import { Grid } from "@mui/material";
import SummaryHistory from "./SummaryHistory";
import SummaryRequest from "./SummaryRequest";

const DefaultDashboard = () => {


    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={6}>
                <SummaryRequest />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
                <SummaryHistory/>
            </Grid>
        </Grid>

    );
};

export default DefaultDashboard;