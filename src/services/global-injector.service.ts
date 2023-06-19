import {appService} from "./app.service";
import AuthService from "./auth.service";
import DatabaseService from "./database.service";

class GlobalInjectorService {
    private _appService = appService;
    private _authService = new AuthService(this._appService.app);
    private _db = new DatabaseService(this._appService.app);

    public get appService() {
        return this._authService;
    }

    public get authService() {
        return this._authService;
    }

    public get db() {
        return this._db;
    }
}

export const globalInjector = new GlobalInjectorService();
