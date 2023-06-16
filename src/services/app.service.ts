import {FirebaseApp, initializeApp } from 'firebase/app';

class AppService {

    private firebaseConfig = {
        
    };
    private _app: FirebaseApp = initializeApp(this.firebaseConfig);

    public get app() {
        return this._app;
    }
}

export const appService = new AppService();
