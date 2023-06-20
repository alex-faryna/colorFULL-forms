import {MutableRefObject, useEffect, useRef, useState} from "react";


function useInView(ref: MutableRefObject<HTMLElement | null>): boolean {
    const [visible, setVisible] = useState(false);

    const observer = useRef(new IntersectionObserver((entries) => {
        entries.length && setVisible(entries[0].intersectionRatio != 0);
    }));

    useEffect(() => {
        if (ref.current) {
            observer.current.observe(ref.current);
        }
        return () => observer.current.disconnect();
    }, []);

    return visible;
}

function useInViewCallBack(ref: MutableRefObject<HTMLElement | null>, callback: (val: boolean) => void, threshold = 0): void {
    const observer = useRef(new IntersectionObserver((entries) => {
        entries.length && callback(entries[0].intersectionRatio > 0);
    }));

    useEffect(() => {
        if (ref.current) {
            observer.current.observe(ref.current);
        }
        return () => observer.current.disconnect();
    }, []);
}

export { useInView, useInViewCallBack };
