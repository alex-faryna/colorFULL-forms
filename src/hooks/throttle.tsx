import {useCallback, useRef} from 'react'

function useThrottleCallback<T>(callback: (val: T) => void, delay = 500): (val: T) => void {
    const canBeCalled = useRef(true);
    const timer = useRef<NodeJS.Timeout>();

    useCallback(() => {
        return () => clearTimeout(timer.current!);
    }, [])

    return useCallback((val) => {
        if (canBeCalled.current) {
            canBeCalled.current = false;
            callback(val);
            timer.current = setTimeout(() => canBeCalled.current = true, delay);
        }
    }, [callback]);
}

export default useThrottleCallback
