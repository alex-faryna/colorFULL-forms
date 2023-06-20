import {Auth, getAuth, onAuthStateChanged, signInWithEmailAndPassword, User} from 'firebase/auth'
import { FirebaseApp } from "firebase/app";

export default class AuthService {
    private _key = '';
    private _auth: Auth;

    constructor(app: FirebaseApp) {
        this._auth = getAuth(app);
    }

    get user() {
        return this._auth.currentUser;
    }

    get key() {
        return this._key;
    }

    listenUser(callback: (value: User | null) => void) {
        return onAuthStateChanged(this._auth, user => callback(user));
    }

    signInWithEmail(email: string, password: string) {
        return signInWithEmailAndPassword(this._auth, email, password);
    }

    signOut(): Promise<void> {
        return this._auth.signOut();
    }
}
