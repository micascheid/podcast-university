import {Fragment, React, useState} from 'react';
import {Button, Stack, TextField, Typography} from "@mui/material";
import {LoadingButton} from '@mui/lab';
import { getFunctions, httpsCallable} from "firebase/functions";
import axios from 'axios';

// const API_BASE_URL = 'http://0.0.0.0:8080';
const API_BASE_URL = 'https://api.podcastsummary.io';
// const API_BASE_URL = 'http://35.199.26.109';

//p100
// const API_BASE_URL = 'http://35.239.225.139';
// const API_BASE_URL = 'http://localhost:8080';
// 35.237.121.222
const DefaultDashboard = () => {
    const [podLink, setPodLink] = useState('');
    const [isLink, setIsLink] = useState(false);
    const [error, setError] = useState(false);
    const [helperText, setHelperText] = useState('');
    const [summary, setSummary] = useState('');
    const [isActiveButton, setIsActiveButton] = useState(null);
    const [isSummarizing,setIsSummarizing] = useState(false);
    const handleTextChange = (event) => {
        const linkVal = event.target.value;
        setIsLink(!!linkVal);
        setPodLink(linkVal);
    }

    const getSummary = async (link, numBulletPoints) => {
        console.log("trying summary");
        const data = {
            podcastEpisodeLink: link,
            numBulletPoints:numBulletPoints
        };
        axios.post(`${API_BASE_URL}/get_summary`, data)
            .then((response) => {
                console.log("Episode Name: " +  response.data.transcription);
                setSummary(response.data.transcription);
                setIsSummarizing(false);
                setIsActiveButton(null);
            })
            .catch((error) => {
                console.log("Error:" + error);
                setIsSummarizing(false);
                setIsActiveButton(null);
                setSummary("SOL for right now, we are working on a fix ");
            });
    };
    const linkSubmitHandler = (buttonId) => {
        setIsActiveButton(buttonId);
        setIsSummarizing(buttonId);
        console.log("DATA FROM BUTTON" + buttonId);
        const inputString = podLink;
        const pattern = /^https:\/\/podcasts\.apple\.com\/us\/podcast\//;
        const validLink = pattern.test(inputString);

        if (validLink){
            setError(false);
            setHelperText("Getting your summary!");
            console.log('summary requested');
            getSummary(inputString, buttonId);
        } else {
            setError(true);
            setHelperText("Please enter a valid Apple Podcast Link, Spotify coming soon!")
        }
    }

    const newlineToBreak = (text) => {
        return text.split('\n').map((item, index, array) => (
            <Fragment key={index}>
                {item}
                {index !== array.length-1 && <br />}
            </Fragment>
        ))
    };

    const isDisabled = (buttonId) => {
        if (!isLink){
            return true;
        } else {
            return isActiveButton !== null && isActiveButton !== buttonId;
        }
    };

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
            {/*<Button variant={"contained"} onClick={linkSubmitHandler}>Summarize!</Button>*/}
            <Stack direction={"row"} spacing={2} justifyContent={"space-evenly"}>
                {
                    Array.from({length: 3}, (_, index) => {
                        const buttonId = index + 3;
                        const isLoading = isSummarizing && isActiveButton === buttonId;
                        return (
                            <LoadingButton
                                loading={isLoading}
                                key={buttonId}
                                variant={"contained"}
                                onClick={() => linkSubmitHandler(buttonId)}
                                disabled={isDisabled(buttonId)}>
                                {buttonId + " Bullet Points"}
                            </LoadingButton>

                        )
                    })
                }
            </Stack>
            {isSummarizing && <Typography variant={"h2"}>Getting Your Bullet Points!</Typography>}

            <Typography variant={"h6"}>{newlineToBreak(summary)}</Typography>
        </Stack>
    );
};

export default DefaultDashboard;