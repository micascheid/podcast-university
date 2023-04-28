import logo from './logo.svg';
import './App.css';
import ThemeCustomization from './themes';
import ScrollTop from './components/ScrollTop';
import Routes from './routes';
import {useEffect, useState} from "react";
import {auth} from './FirebaseConfig';
import UserContext from "./context/UserContext";
import {signInWithEmailAndPassword, signOut, onAuthStateChanged, getAuth} from "firebase/auth";
import {useNavigate} from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie';

const App = () => {

    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const cookieUser = CreateCookieUser();
        const signedIn = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                setUser(cookieUser);
            }
        });
        return () => {
            signedIn();
        };
    }, []);


    const CreateCookieUser = () => {
        let uid = Cookies.get('uid');
        let total_uses;
        if (!uid) {
            uid = uuidv4();
            Cookies.set('uid', uid, {expires: 365});
            Cookies.set('total_uses', "0", {expires: 365});
        } else {
            total_uses = Cookies.get('total_uses');
        }

        return {uid: uid, total_uses: total_uses, email: ""};
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
          <ThemeCustomization>
              <ScrollTop>
                  <Routes />
              </ScrollTop>
          </ThemeCustomization>
      </UserContext.Provider>

  )
};

export default App;
