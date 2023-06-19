import {appService} from "./app.service";
import AuthService from "./auth.service";

class GlobalInjectorService {
    private _appService = appService;
    private _authService = new AuthService(this._appService.app);

    public get appService() {
        return this._authService;
    }

    public get authService()
    {
        return this._authService;
    }
}

export const globalInjector = new GlobalInjectorService();
