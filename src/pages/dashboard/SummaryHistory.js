import {useState, react, useEffect, useContext} from 'react';
import MainCard from "../../components/MainCard";
import {Box, Typography} from "@mui/material";
import { API_URL } from "../../constants";
import { collection, query, where, onSnapshot} from "firebase/firestore";
import { db, auth } from '../../FirebaseConfig';
import SummaryObj from "./SummaryObj";
import SummaryItems from "./SummaryItems";

//context
import UserContext from '../../context/UserContext';
const SummaryHistory = () => {
    const [summaryItems, setSummaryItems] = useState([]);
    const { user } = useContext(UserContext);
    let userId = null;
    if (user) {
        userId = user.uid;
    }

    // users(Collection)/User(doc)/summaries(Collection)/uid_summary(doc)
    useEffect(() => {
        if (user){
            const q = query(collection(db, `summaries`), where("uid", "==", `${user.uid}`));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                querySnapshot.docChanges().forEach((change) => {
                    if (change.type === 'added') {
                        const summaryObj = new SummaryObj(change.doc.data().pod_name, change.doc.data().summary,
                            change.doc.data().summary_type);

                        setSummaryItems(prevState => [summaryObj, ...prevState]);
                    }
                });
            });
            return () => {
                unsubscribe();
            };
        }
    },[user]);

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