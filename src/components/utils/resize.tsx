import {MutableRefObject, useEffect, useRef, useState} from 'react'
import {useDebounceCallback} from "./debounce";

function useResize(elem: MutableRefObject<HTMLElement | null>, debounce = 0): number {
    const [width, setWidth] = useState(0);
    const initialVal = useRef(false);
    const widthChanged = (entries: ResizeObserverEntry[]) =>
        entries.length && setWidth(entries[0].contentRect.width);
    const callback = useDebounceCallback(widthChanged, debounce);
    const observer = useRef(new ResizeObserver((entries) => {
        if (initialVal.current) {
            callback(entries);
        } else {
            initialVal.current = true;
            widthChanged(entries);
        }
    }));

    useEffect(() => {
        if (elem.current) {
            initialVal.current = false;
            observer.current.observe(elem.current);
        }

        return () => observer.current.disconnect();
    }, []);

    return width;
}

export default useResize;
