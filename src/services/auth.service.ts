import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'



class AuthService {



    private _callback: Function = () => { }

    public init(callback: (val: boolean) => void): void {
        this._callback = callback;
    }

    public updateVisibility(val: boolean): void {
        this._callback(val);
    }
}

export const authService = new AuthService();
