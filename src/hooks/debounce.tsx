import {useCallback, useEffect, useRef, useState} from 'react'

function useDebounceCallback<T>(callback: (val: T) => void, delay = 500): (val: T) => void {
    const timer = useRef<NodeJS.Timeout>();

    return useCallback((val) => {
        clearTimeout(timer.current!);
        timer.current = setTimeout(() => callback(val), delay);
    }, [callback]);
}

function useDebounce<T>(value: T, delay?: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value)

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay || 500)

        return () => clearTimeout(timer);
    }, [value, delay])

    return debouncedValue
}

export { useDebounce, useDebounceCallback }
