import { react } from 'react';
import {Box, Divider, Stack, Typography} from "@mui/material";
import SummaryItem from "./SummaryItem";
import MainCard from "../../components/MainCard";


const SummaryItems = (props) => {


    return (
        <Box>
            {props.summaryItems.map((summaryItem, index) => (
                <MainCard key={index}
                     style={{
                         backgroundColor: index % 2 === 0 ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 1)',
                     }}>
                    <Divider>Summary for: {summaryItem.pod_name}</Divider>
                    <SummaryItem summaryItem={summaryItem}/>
                </MainCard>
            ))}
        </Box>

    );
};

export default SummaryItems;