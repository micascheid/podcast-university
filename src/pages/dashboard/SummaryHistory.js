import {useState, react, useEffect} from 'react';
import MainCard from "../../components/MainCard";
import {Box, Typography} from "@mui/material";
import { API_URL } from "../../constants";
import { collection, query, where, onSnapshot} from "firebase/firestore";
import { db, auth } from '../../FirebaseConfig';
import SummaryObj from "./SummaryObj";
import SummaryItems from "./SummaryItems";

const SummaryHistory = () => {
    const [summaryItems, setSummaryItems] = useState([]);
    // users(Collection)/User(doc)/summaries(Collection)/uid_summary(doc)
    useEffect(() => {
        const summaryListener = async () => {
            const uid = auth.currentUser.uid;

            const q = query(collection(db, `users/${uid}/summaries`));
            const summaries = onSnapshot(q, (querySnapshot) => {
                querySnapshot.docChanges().forEach((change) => {
                    if (change.type === 'added') {
                        const summaryObj = new SummaryObj(change.doc.data().pod_name, change.doc.data().summary);
                        setSummaryItems(prevState => [summaryObj, ...prevState]);
                        console.log(change.doc.data().pod_name + "\n" + change.doc.data().summary);
                    }
                });
            });
        };
        return () => summaryListener();
    },[]);

    return (
        <MainCard>
            <Box display={"flex"} justifyContent={"center"}>
                <Typography variant={"h3"} >Summary History</Typography>
            </Box>
            <SummaryItems summaryItems={summaryItems}/>
        </MainCard>
    )
}

export default SummaryHistory;