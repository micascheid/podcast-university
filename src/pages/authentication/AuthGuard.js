import React, {Fragment, useState} from 'react';
import {Outlet, Navigate, useNavigate} from "react-router-dom";
import { getAuth, onAuthStateChanged } from 'firebase/auth';


const AuthGuard = (props) => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (user){
            setIsLoggedIn(true);
        } else {
            navigate('/login');
        }
    });

    return (
        <Fragment>
            {isLoggedIn ? props.children : null}
        </Fragment>
    );
};

export default AuthGuard;