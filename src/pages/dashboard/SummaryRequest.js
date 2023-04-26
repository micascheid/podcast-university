import {Fragment, react, useState} from 'react';
import {Stack, TextField, Typography} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {API_URL} from '../../constants';
import MainCard from "../../components/MainCard";
import axios from "axios";
import { auth } from '../../FirebaseConfig';


const SummaryRequest = () => {
    // VARIABLE DECLARATIONS
    const [podLink, setPodLink] = useState('');
    const [isLink, setIsLink] = useState(false);
    const [error, setError] = useState(false);
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [isActiveButton, setIsActiveButton] = useState(null);
    const [summary, setSummary] = useState('');
    const [helperText, setHelperText] = useState('');
    const userId = auth.currentUser.uid;
    // FUNCTIONS
    const handleTextChange = (event) => {
        const linkVal = event.target.value;
        setIsLink(!!linkVal);
        setPodLink(linkVal);
    }

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
            getSummary(inputString, buttonId, userId);
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
    const getSummary = async (link, numBulletPoints, userId) => {
        console.log("trying summary for user... " + userId);
        const data = {
            podcastEpisodeLink: link,
            numBulletPoints:numBulletPoints,
            uid: userId
        };
        axios.post(`${API_URL}/get_summary`, data)
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
                setSummary("We've run into a problem working on your request");
            });
    };

    const isDisabled = (buttonId) => {
        if (!isLink){
            return true;
        } else {
            return isActiveButton !== null && isActiveButton !== buttonId;
        }
    };


    return (
        <MainCard>
            <Stack spacing={2}>
                <Typography variant={"h3"}>Paste your apple podcast link below</Typography>
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
        </MainCard>
    )
}

export default SummaryRequest;