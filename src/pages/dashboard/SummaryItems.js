import React from 'react';
import {Box, Divider} from "@mui/material";
import SummaryItem from "./SummaryItem";
import MainCard from "../../components/MainCard";
import Typography from "@mui/material/Typography";


const SummaryItems = (props) => {


    return (
        <Box>
            {props.summaryItems.map((summaryItem, index) => (
                <MainCard key={index}
                     style={{
                         backgroundColor: index % 2 === 0 ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 1)',
                     }}>
                    <Box display="flex" alignItems="center" width="100%" justifyContent={"center"}>
                        <Divider flexItem />
                        <Box
                            mx={1}
                            component={Typography}
                            variant="subtitle1"
                            noWrap
                            overflow="hidden"
                            textOverflow="ellipsis"
                        >
                            Notes for: {summaryItem.pod_name}
                        </Box>
                        <Divider flexItem />
                    </Box>
                    <SummaryItem summaryItem={summaryItem}/>
                </MainCard>
            ))}
        </Box>

    );
};

export default SummaryItems;