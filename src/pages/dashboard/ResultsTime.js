import React from 'react';
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";




const ResultsTime =() => {

    const createData = (podcast_length, time_to_complete) => {
        return { podcast_length, time_to_complete };
    }

    const rows = [
        createData('0min-15min', "1 min", ),
        createData('15min-30min', "1-2 min"  ),
        createData('30min-1hour', "2-4 min", ),
        createData('1hour-2hour', "4-8 min", ),
    ];

    return (
        <TableContainer component={Paper}>
            <Typography
                sx={{ flex: '1 1 100%' }}
                variant={"h4"}
                id="tableTitle"
                component="div"
                textAlign={"center"}
            >
                Time Table for New Podcast Summaries
            </Typography>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Podcast Length</TableCell>
                        <TableCell align="right">Time to Complete</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row.podcast_length}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.podcast_length}
                            </TableCell>
                            <TableCell align="right">{row.time_to_complete}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Typography
                sx={{ flex: '1 1 100%' }}
                variant={"h5"}
                id="tableTitle"
                component="div"
                textAlign={"center"}
            >
                Summary variations for the same podcast take around 10secs
            </Typography>
        </TableContainer>
    );
};

export default ResultsTime;