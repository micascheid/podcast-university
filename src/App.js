import './App.css';
import ThemeCustomization from './themes';
import ScrollTop from './components/ScrollTop';
import Routes from './routes';
import {useEffect, useState} from "react";
import {auth} from './FirebaseConfig';
import UserContext from "./context/UserContext";
import {signOut, onAuthStateChanged,} from "firebase/auth";
import {useNavigate} from "react-router-dom";
import {v4 as uuidv4} from 'uuid';
import Cookies from 'js-cookie';
import {doc, getDoc, setDoc} from "firebase/firestore";
import {db} from "./FirebaseConfig";
import LoadingSite from "./pages/dashboard/LoadingSite";
import {USER_INIT_OBJECT} from "./constants";
import SiteIssue from "./pages/dashboard/SiteIssue";

const App = () => {
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [failedToLoad, setIsFailedToLoad] = useState(false);
    const [userLoadFail, setIsUserLoadFail] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        const signedIn = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setIsFailedToLoad(false);
                setLoadingUser(false);
            } else {
                await GetCookieUser().then((cookieUser) => {
                    setUser(cookieUser);
                    setIsFailedToLoad(false);
                    setLoadingUser(false);
                }).catch((error) => {
                    console.log("GettCookieUserError: ", error);
                    setIsFailedToLoad(true);
                    setLoadingUser(true);
                });
            }
        });
        return () => {
            signedIn();
        };
    }, []);

    const CheckCookiesBlocked = () => {
        Cookies.set('test_cookie', 'test_value');

        // Read the test cookie
        const testCookieValue = Cookies.get('test_cookie');
        // Check if the test cookie is blocked
        if (testCookieValue === undefined) {
            return true;
        } else {
            // Clean up the test cookie
            Cookies.remove('test_cookie');
            return false;
        }
    };
    const GetCookieUser = async () => {
        if (!CheckCookiesBlocked()) {
            try {
                let uid = Cookies.get('uid');
                if (uid === undefined) {
                    uid = uuidv4();
                    Cookies.set('uid', uid, {expires: 365})
                    await setDoc(doc(db, "users", uid),
                        USER_INIT_OBJECT).catch((error) => {
                        console.log("Trouble registering cookie user");
                        setIsFailedToLoad(true);
                    });
                }
                return {uid: uid};
            } catch (error) {
                console.log("Trouble loading user:", error);
                throw error;
            }
        } else {
            console.log("COOKIES BLOCKED");
            setIsUserLoadFail('cookies');
            setIsFailedToLoad(true);
            setLoadingUser(true);
            throw new Error('Cookies blocked');

        }

    };
    const login = (user) => {
        setUser(user);
    };

    const logout = () => {
        signOut(auth).then(() => {
            navigate('/login');
        });
        setUser(null);
    };

    return (
        <ThemeCustomization>
            {loadingUser ?
                (
                    <>
                        {failedToLoad ? (
                            <SiteIssue />
                        ) : (
                            <LoadingSite/>
                        )}
                    </>
                )
                :
                (
                    <UserContext.Provider value={{user, login, logout}}>
                        <ScrollTop>
                            <Routes/>
                        </ScrollTop>
                    </UserContext.Provider>
                )
            }
        </ThemeCustomization>
    )
};

export default App;
