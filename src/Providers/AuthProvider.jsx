import PropTypes from 'prop-types';
import { createContext, useEffect, useState } from 'react';
import {
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut
} from "firebase/auth";
import auth from '../Firebase/firebase.config';

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    const provider = new GoogleAuthProvider();

    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const signInUser = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    const signOutUser = () => {
        setLoading(true);
        return signOut(auth);
    };

    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            if (currentUser && currentUser.email) {
                try {
                    const res = await fetch(`https://nishibarta-server.vercel.app/user-details/${currentUser.email}`);
                    const data = await res.json();
                    setUserDetails(data);
                } catch (error) {
                    console.error("Failed to fetch user details:", error);
                    setUserDetails(null);
                }
            } else {
                setUserDetails(null);
            }

            setLoading(false);
        });

        return () => unSubscribe();
    }, []);

    const authInfo = {
        user,
        userDetails,
        loading,
        createUser,
        signInUser,
        signOutUser
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

AuthProvider.propTypes = {
    children: PropTypes.node,
};
