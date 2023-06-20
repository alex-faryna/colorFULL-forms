
class ScrollService {
    private _callback: Function = () => { }

    public init(callback: () => void): void {
        this._callback = callback;
    }

    public useCallback(): void {
        this._callback();
    }
}

export const scrollService = new ScrollService();
