import {Fragment, react, useContext, useState} from 'react';
import {Stack, TextField, Typography} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {API_URL} from '../../constants';
import MainCard from "../../components/MainCard";
import axios from "axios";
import Cookies from 'js-cookie';

//context
import UserContext from '../../context/UserContext';
import ModalRequestLimit from "./ModalRequestLimit";
import {db} from "../../FirebaseConfig";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import ResultsTime from "./ResultsTime";

const SummaryRequest = () => {
    // VARIABLE DECLARATIONS
    const [podLink, setPodLink] = useState('');
    const [isLink, setIsLink] = useState(false);
    const [error, setError] = useState(false);
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [isActiveButton, setIsActiveButton] = useState(null);
    const [summary, setSummary] = useState('');
    const [helperText, setHelperText] = useState('');
    const [limitReachedNot, setLimitReachedNot] = useState(false);
    const { user } = useContext(UserContext);

    // FUNCTIONS
    const handleTextChange = (event) => {
        const linkVal = event.target.value;
        setIsLink(!!linkVal);
        setPodLink(linkVal);
    }

    const getUserTotalUses = async (user) => {
        let total_uses = 0;
        if (user.uid.indexOf("-") >= 0) {
            total_uses = parseInt(Cookies.get('total_uses'));
            console.log("TOTAL_USES WITH COOKIES GET:" + total_uses);
        } else {
            const userRef = doc(db, `users/${user.uid}`)
            const docSnap = await getDoc(userRef);
            if (docSnap.exists()) {
                total_uses = docSnap.data().total_uses
            }
        }

        return total_uses;
    };

    const linkSubmitHandler = async (buttonId) => {
        setIsActiveButton(buttonId);
        setIsSummarizing(buttonId);
        console.log("DATA FROM BUTTON" + buttonId);
        const inputString = podLink;
        const pattern = /^https:\/\/podcasts\.apple\.com\/us\/podcast\//;
        const validLink = pattern.test(inputString);

        // Check if user is a cookie user and has <=5 total_uses
        await getUserTotalUses(user).then((total_uses) => {
            if (validLink && total_uses < 5){
                setError(false);
                setHelperText("Getting your summary!");
                console.log('summary requested');
                getSummary(inputString, buttonId, user.uid);
            } else if (total_uses >= 5){
                console.log("LOOKS LIKE YOUR OUT OF USES!");
                setLimitReachedNot(true);
                setError(true);
                setHelperText("Looks like your out of uses, sign up to get more summaries!")
                setIsSummarizing(false);
                setIsActiveButton(null);
            } else{
                setError(true);
                setHelperText("Please enter a valid Apple Podcast Link, Spotify coming soon!")
                setIsSummarizing(false);
                setIsActiveButton(null);
            }
        }).catch((error) => {
            console.log("Error with grabbing total_uses on user");
        })

    }

    const setLimitReachedNotHandler = () => {
        setLimitReachedNot(false);
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

                // Add +=total_uses for non registered emails
                if (user.email === "") {
                    const total_uses = parseInt(Cookies.get('total_uses')) + 1;
                    Cookies.set('total_uses', total_uses);
                }
                //Add uses for registered users
                const userRef = doc(db, `users/${user.uid}`);
                updateDoc(userRef, {
                    total_uses: increment(1)
                });
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
                <ResultsTime />
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
                {limitReachedNot &&
                <ModalRequestLimit closeModal={setLimitReachedNotHandler}/>
                }
            </Stack>
        </MainCard>
    )
};

export default SummaryRequest;