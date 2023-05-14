import React, {useState} from 'react';
import {
    Button, Collapse, IconButton,
    Paper, Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import { KeyboardArrowRight, KeyboardArrowDown } from "@mui/icons-material";
import Box from "@mui/material/Box";



const ResultsTime =() => {
    const [collapsed, setCollapsed] = useState(true);
    const createData = (podcast_length, time_to_complete) => {
        return { podcast_length, time_to_complete };
    }

    const rows = [
        createData('0min-15min', "1 min", ),
        createData('15min-30min', "1-2 min"  ),
        createData('30min-1hour', "2-4 min", ),
        createData('1hour-2hour', "4-8 min", ),
    ];

    const toggleCollapse = () => {
      setCollapsed(!collapsed);
    };

    return (
        <TableContainer component={Paper}>
            <Stack direction={"row"}>
                {collapsed ? (
                    <KeyboardArrowDown color={"primary"} onClick={toggleCollapse} />
                ) : (
                    <KeyboardArrowRight color={"primary"} onClick={toggleCollapse} />
                )}
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    variant={"h4"}
                    id="tableTitle"
                    component="div"
                    textAlign={"center"}
                >
                    Time Table for New Podcast Notes
                </Typography>
            </Stack>

            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Podcast Length</TableCell>
                        <TableCell align="right">Time to Complete</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell colSpan={2}>
                            {rows.map((row) => (
                                <React.Fragment key={row.podcast_length}>
                                    <Collapse in={collapsed}>
                                        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell component="th" scope="row" sx={{ whiteSpace: 'nowrap'}}>
                                                {row.podcast_length}
                                            </TableCell>
                                            <TableCell style={{ width: '100%' }}>
                                                <Box display="flex" justifyContent="flex-end">
                                                    {row.time_to_complete}
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    </Collapse>
                                </React.Fragment>
                            ))}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <Typography
                sx={{ flex: '1 1 100%' }}
                variant={"h5"}
                id="tableTitle"
                component="div"
                textAlign={"center"}
            >
                Note variations for the same podcast take around 10-20secs
            </Typography>
        </TableContainer>
    );
};

export default ResultsTime;