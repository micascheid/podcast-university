import {Fragment, react} from 'react';
import {Box, Typography} from "@mui/material";


const SummaryItem = (props) => {
    const newlineToBreak = (text) => {
        return text.split('\n').map((item, index, array) => (
            <Fragment key={index}>
                {item}
                {index !== array.length-1 && <br />}
            </Fragment>
        ))
    };


    return (
        <Box>
            <Typography>Note Type: {props.summaryItem.summary_type} bullet points</Typography>
            <Typography>{newlineToBreak(props.summaryItem.summary)}</Typography>
        </Box>
    );
};

export default SummaryItem;