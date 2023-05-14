import {Fragment, useContext, useEffect, useState} from 'react';
import {Button, Card, Stack, TextField, Typography} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {API_URL} from '../../constants';
import MainCard from "../../components/MainCard";
import axios from "axios";

//context
import UserContext from '../../context/UserContext';
import ModalRequestLimit from "./ModalRequestLimit";
import {db} from "../../FirebaseConfig";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import ResultsTime from "./ResultsTime";
import CircularProgress from "@mui/material/CircularProgress";
import ComingSoon from "./ComingSoon";
import Box from "@mui/material/Box";

const SummaryRequest = () => {
    // VARIABLE DECLARATIONS
    const [podLink, setPodLink] = useState('');
    // const [isLink, setIsLink] = useState(false);
    const [isCheckingLink, setIsCheckingLink] = useState(false);
    const [error, setError] = useState(false);
    const [summary, setSummary] = useState('Enter a podcast above to get started!');
    const [helperText, setHelperText] = useState('');
    const [limitReachedNot, setLimitReachedNot] = useState(false);
    const [isRequestingSummary, setIsRequestingSummary] = useState(false);
    const { user } = useContext(UserContext);
    const userRef = doc(db, `users/${user.uid}`);
    // FUNCTIONS
    const handleTextChange = (event) => {
        const linkVal = event.target.value;
        setPodLink(linkVal);
    }

    const getUserTotalUses = async () => {
        let total_uses = 0;
        const userRef = doc(db, `users/${user.uid}`)
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
            total_uses = docSnap.data().total_uses;

        }

        return total_uses;
    };

    const linkSubmitHandler = async (buttonId) => {
        const inputString = podLink;
        // const pattern = /^https:\/\/podcasts\.apple\.com\/us\/podcast\//;
        // const validLink = pattern.test(inputString);

        const validLink = applePodcastLinkCheck(inputString);
        // Check if user has <=3 total_uses
        await getUserTotalUses(user).then((total_uses) => {
            if (validLink && total_uses < 3){
                setError(false);
                getSummary(inputString, buttonId, user.uid);
            } else if (total_uses >= 3){
                setLimitReachedNot(true);
                setError(true);
                setHelperText("Looks like your out of uses, sign up to get more notes!")
                // setIsRequestingSummary(false);
            } else{
                setError(true);
                setHelperText("Please enter a valid Apple Podcast Link or try again, Spotify coming soon!")
                // setIsRequestingSummary(false);
            }
        }).catch((error) => {
            console.log("Error with link submission: ", error);
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

    const applePodcastLinkCheck = (link) => {
        const pattern = /^https:\/\/podcasts\.apple\.com\/[a-z]{2}\/podcast\/.*\D(\d{13})$/;
        return pattern.test(link);
    };
    const getSummary = async (link, numBulletPoints) => {
        await updateDoc(userRef, {
            requesting: true
        }).catch((error) => {
            setIsRequestingSummary(false);
            setHelperText("It appears we are experiencing troubles. Please try again at a later time.");
        });
        const data = {
            podcastEpisodeLink: link,
            numBulletPoints:numBulletPoints,
            uid: user.uid
        };
        setIsRequestingSummary(true);
        setHelperText('');
        await axios.post(`${API_URL}/get_summary`, data)
            .then((response) => {
                console.log()
                setSummary(response.data.transcription);
                setIsRequestingSummary(false);
                setHelperText(null);
            }).then(() => {
                updateDoc(userRef, {
                    total_uses: increment(1),
                    requesting: false
                });
            })
            .catch((error) => {
                if (error.response) {
                    if (error.response.data.description === "podlink") {
                        setHelperText("Check your Apple Podcast Link and try again. This episode may be incompatible at this time.");
                    }
                    if (error.response.data.description === "bulletpoints") {
                        setHelperText("We are having issues on our end. Our apologies please try another podcast");
                    }
                }
                updateDoc(userRef, {
                    requesting: false
                });
                setIsRequestingSummary(false);
                setError(true);
            });
    };

    useEffect(() => {
        const fetchUserMeta = async () => {
            const userDocMeta = await getDoc(userRef);
            if (userDocMeta.exists()) {
                setIsRequestingSummary(userDocMeta.data().requesting);
            }
        };

        if (user.uid) {
            fetchUserMeta();
        }
    }, []);


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
                            return (
                                <Button
                                    key={buttonId}
                                    variant={"contained"}
                                    onClick={() => linkSubmitHandler(buttonId)}
                                    disabled={isCheckingLink || isRequestingSummary}>
                                    {buttonId + " Bullet Points"}
                                </Button>
                            )
                        })
                    }
                </Stack>
                {isRequestingSummary &&
                    <Stack spacing={2} direction={"row"}>
                        <Typography variant={"h2"}>Summary on the way!</Typography>
                        <CircularProgress />
                    </Stack>
                }
                <MainCard sx={{ backgroundColor: 'rgba(255, 255, 255, 255)'}}>
                    <Typography variant={"h4"}>Latest</Typography>
                    <Typography variant={"h6"}>{newlineToBreak(summary)}</Typography>
                </MainCard>
                {limitReachedNot &&
                <ModalRequestLimit closeModal={setLimitReachedNotHandler}/>
                }
                <ComingSoon />
            </Stack>
        </MainCard>
    )
};

export default SummaryRequest;