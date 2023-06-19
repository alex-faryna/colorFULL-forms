import {Auth, getAuth, onAuthStateChanged, signInWithEmailAndPassword, User} from 'firebase/auth'
import { FirebaseApp } from "firebase/app";

export default class AuthService {
    private _auth: Auth;

    constructor(app: FirebaseApp) {
        this._auth = getAuth(app);
    }

    get user() {
        return this._auth.currentUser;
    }

    listenUser(callback: (value: User | null) => void) {
        return onAuthStateChanged(this._auth, user => callback(user));
    }

    signInWithEmail(email: string, password: string): void {
        signInWithEmailAndPassword(this._auth, '', '')
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;

                console.log(user);
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;

                console.log('err:');
                console.log(error);
            });
    }

    signOut(): Promise<void> {
        return this._auth.signOut();
    }
}