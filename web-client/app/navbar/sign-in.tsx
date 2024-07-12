'use client';
import { Fragment } from "react";
import { signInWithGoogle, signOut } from "../utility/firebase/firebase";
import styles from "./sign-in.module.css"
import { User } from "firebase/auth";

interface SignInProps{
    user: User | null;
}

// "{user}: SignInProps" This format is call destruct assignment
export default function SignIn({user}: SignInProps){
    return(
        <Fragment>
            { user?
                (
                <button className={styles.signin} onClick={signOut}>
                    Sign Out
                </button>
                ):(
                <button className={styles.signin} onClick={signInWithGoogle}>
                    Sign In
                </button>
                )
            }
        </Fragment>
    );
}