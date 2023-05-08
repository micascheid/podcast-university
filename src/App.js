import './App.css';
import ThemeCustomization from './themes';
import ScrollTop from './components/ScrollTop';
import Routes from './routes';
import {useEffect, useState} from "react";
import {auth} from './FirebaseConfig';
import UserContext from "./context/UserContext";
import { signOut, onAuthStateChanged, } from "firebase/auth";
import {useNavigate} from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie';
import {doc, getDoc, setDoc} from "firebase/firestore";
import { db } from "./FirebaseConfig";
import LoadingSite from "./pages/dashboard/LoadingSite";
import { USER_INIT_OBJECT} from "./constants";

const App = () => {
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        const signedIn = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                const cookieUser = await GetCookieUser();
                setUser(cookieUser);
            }
            setLoadingUser(false);
        });
        return () => {
            signedIn();
        };
    }, []);


    const GetCookieUser = async () => {
        try {
            let uid = Cookies.get('uid');
            if (uid === undefined) {
                uid = uuidv4();
                Cookies.set('uid', uid, {expires: 365});
                await setDoc(doc(db, "users", uid),
                    USER_INIT_OBJECT);
            }
            return {uid: uid};
        } catch (error) {
            console.log("Trouble loading user:", error);
            setLoadingUser(true);
            throw error;
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
      <UserContext.Provider value={{user, login, logout}}>
          {loadingUser ? (
              <LoadingSite />
          ) : (
              <ThemeCustomization>
                  <ScrollTop>
                      <Routes />
                  </ScrollTop>
              </ThemeCustomization>
          )}
      </UserContext.Provider>
  )
};

export default App;
