
class CreateQuizButtonVisible {
    private _callback: Function = () => { }

    public init(callback: (val: boolean) => void): void {
        this._callback = callback;
    }

    public updateVisibility(val: boolean): void {
        this._callback(val);
    }
}

export const createQuizButtonVisibilityService = new CreateQuizButtonVisible();
