// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFunctions } from "firebase/functions";
import { getAuth, 
    signInWithPopup, 
    GoogleAuthProvider,
    onAuthStateChanged,
    User, 
    UserCredential
} from "firebase/auth";



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCODZdMTzqG0etmZCXzNNEWTNZshgYLUyY",
  authDomain: "yt-clone-52b0b.firebaseapp.com",
  projectId: "yt-clone-52b0b",
  appId: "1:820041348245:web:2240a1d56a7c65df1d579c",
  measurementId: "G-J2HJRBS7PB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
export const functions = getFunctions();

/**
 * Signs the user in, with Google PopUp
 * @returns A promise that resolves with the User's credentials
 */

export function signInWithGoogle(): Promise<UserCredential> {
    return signInWithPopup(auth, new GoogleAuthProvider());
}

/**
 * Signs the user out
 * @returns A promise that resolves when the user is signed out
 */

export function signOut(): Promise<void> {
    return auth.signOut();
}

/**
 * Triggers a callback when the user's authentication state changes.
 * Creating this Wrapper function so that we don't have to expose the auth variable to the ouside
 * @returns A function to unsubscribe callback.
 */
export function onAuthStateChangedHelper(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }