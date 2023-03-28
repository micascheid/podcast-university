import {React, useState} from 'react';
import {Button, Stack, TextField, Typography} from "@mui/material";




const DefaultDashboard = () => {
    const [podLink, setPodLink] = useState('');
    const [error, setError] = useState(false);
    const [helperText, setHelperText] = useState('');

    const handleTextChange = (event) => {
        setPodLink(event.target.value);
    }
    const linkSubmitHandler = () => {
        /*
        1.) link validation https://podcasts.apple.com/us/podcast/
        2.) Send request to cloud function
         */
        const inputString = podLink;
        const pattern = /^https:\/\/podcasts\.apple\.com\/us\/podcast\//;

        const validLink = pattern.test(inputString);
        if (validLink){
            setError(false);
            setHelperText("Getting your summary!")
            console.log('summary requested');
        } else {
            setError(true);
            setHelperText("Please enter a valid Apple Podcast Link, Spotify coming soon!")
        }
    }

    return (
        <Stack spacing={2}>
            <Typography variant={"h1"}>Paste your apple podcast link below</Typography>
            <TextField
                id={"outlined-basic"}
                value={podLink}
                label={"Apple Podcast Link"}
                variant={"outlined"}
                onChange={handleTextChange}
                error={error}
                helperText={helperText}></TextField>
            <Button variant={"contained"} onClick={linkSubmitHandler}>Summarize!</Button>
            <Typography variant={"h2"}>Summary:</Typography>
        </Stack>
    );
};

export default DefaultDashboard;