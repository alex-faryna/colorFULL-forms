import React, {memo, MutableRefObject, useCallback, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {stubDataLoaded, taskCreated} from "./store/task-organizer-state";
import "./common-classes.css"
import SideMenu from "./components/side-menu/SideMenu";
import {ColorBubble} from './models/color.model';
import NotesList, {gridService} from './components/notes-list/NotesList';
import {RootState} from "./store";
import {useDebounceCallback} from "./components/utils/debounce";
import useThrottleCallback from "./components/utils/throttle";

const DEFAULT_CELL_WIDTH = 100;
const DEFAULT_CELL_HEIGHT = 40;

const DEFAULT_X_COUNT = 26;
const DEFAULT_Y_COUNT = 100;

function getAxisCount(axis: number, defaultCellValue: number) {
    return Math.ceil(4 * axis / defaultCellValue);
}

function initialGridLayout(width: number, height: number) {
    const xCellCount = getAxisCount(width, DEFAULT_CELL_WIDTH);
    const yCellCount = getAxisCount(height, DEFAULT_CELL_HEIGHT);
    return [xCellCount, yCellCount];
}

// grid type: rows - info about rows, cols - info about cols, cells - actual cell data? or mb map with coords better or arrays better mb

const GridCell = memo(function ({ val, header }: { val: string | number, header?: 'left' | 'top' | 'both' }) {
    const styles = {
        width: `${DEFAULT_CELL_WIDTH}px`,
        height: `${DEFAULT_CELL_HEIGHT}px`,
        ...(header === 'left' && { left: 0 }),
        ...(header === 'top' && { top: 0 }),
        ...(header === 'both' && { top: 0, left: 0 }),
    };
    return <div style={styles} className={`grid-cell ${header ? 'grid-header-cell' : ''}`}>Cell { val }</div>
})

function useScrollBreakPoint(elem: MutableRefObject<HTMLElement | null>, offsetLeft: number): number {
    const [scroll, setScroll] = useState(0);
    const callback = useThrottleCallback(() => {
        const container = elem.current;
        if (!container) return;
        const scrollLeft = container.scrollLeft;

        const w = container.getBoundingClientRect().width;
        const padding = getComputedStyle(container).paddingLeft;
        const width = getComputedStyle(container).width;
        console.log(padding);
        console.log(width);

        console.log(`updated left! ${offsetLeft}`);
        console.log(container.scrollLeft);
        console.log(container.scrollWidth);
        console.log(w);
        console.log(`Breakpoint: ${container.scrollWidth - 2 * w}`);
        console.log('---');
        console.log(scrollLeft);
        console.log(container.scrollWidth - 2 * w);
        console.log('---');

        if (scrollLeft && (scrollLeft) >= container.scrollWidth - 2 * w) {
            setScroll(scrollLeft);
        }
    }, 150);

    useEffect(() => {
        const container = elem.current;
        if (!container) return;
        container.addEventListener("scroll", callback);

        return () => container.removeEventListener("scroll", callback);
    }, [offsetLeft]);

    return scroll;
}

function Grid() {
    const xCount = useRef(0);

    const [leftIndex, setLeftIndex] = useState(0);
    const [rightIndex, setRightIndex] = useState(0);


    const container = useRef<HTMLDivElement>(null);

    const scrollLeft = useScrollBreakPoint(container, leftIndex * 100);
    const [cells, setCells] = useState<{ cells: number[][], x: number, y: number }>({ cells: [], x: 0, y: 0 });

    useEffect(() => {
        if (!container.current) return;
        const [x, y] = initialGridLayout(container.current.offsetWidth, container.current.offsetHeight);
        xCount.current = x;
        const xRow = () => Array.from({ length: 1000 }, () => 0);
        const tempCells = Array.from({ length: y }, xRow);
        setCells({ cells: tempCells, x, y });
        setRightIndex(x);
    }, []); // container.current

    // console.log(cells.cells);

    /*const headerRow = Array.from({ length: cells.x }, (_, idx) => {
        // const col = String.fromCharCode(idx + 65);
        const col = idx + 1;
        return <GridCell key={`Header ${col}`} header='top' val={`Header ${col}`} />
    });*/

    useEffect(() => {
        if (container.current && scrollLeft) {
            // console.log(`brek pnt ${scrollLeft}`);

            console.log('update!');

            const ddd = Math.floor(xCount.current / 4);

            // container.current.style.paddingLeft = `${leftIndex + xCount.current * 100}px`;
            // container.current.scrollLeft = leftIndex + xCount.current * 100;

            const offset = (leftIndex + ddd) * 100;
            const adv = scrollLeft - offset;

            console.log(`Set scroll ${adv + (leftIndex + ddd) * 100}`);
            container.current.scrollLeft = adv + (leftIndex + ddd) * 100;
            container.current.style.paddingLeft = `${(leftIndex + ddd) * 100}px`;

            setLeftIndex(i => i + ddd);
            setRightIndex(r => r + ddd);
        }
    }, [scrollLeft]);

    console.log(`Render ${scrollLeft}`);

    /*if (container.current && !rrr.current) {
        // after scrolled probably

        // the loaded items should have 2x screen size in both axis (x only for now)

        // if we get close to the screen size, we should load the next batch (1x screen size), this way we have always 3 screen sizes


        // if we go right, we should load when we have 1x screen of width left
        // container.current.scrollWidth - 2 * container.current.offsetWidth

        console.log(scrollLeft);
        console.log(container.current.scrollWidth);
        console.log(container.current.offsetWidth);

        if (scrollLeft && scrollLeft > container.current.scrollWidth - 2 * container.current.offsetWidth) {
            // console.log('update!');
            console.log(scrollLeft);
            console.log(container.current.scrollWidth);
            console.log(container.current.offsetWidth);
            console.log('should load bro');
            rrr.current = true;
            const ddd = Math.floor(xCount.current / 3);

            // container.current.style.paddingLeft = `${leftIndex + xCount.current * 100}px`;
            // container.current.scrollLeft = leftIndex + xCount.current * 100;

            const offset = (leftIndex + ddd) * 100;
            const adv = scrollLeft - offset;

            container.current.scrollLeft = adv + (leftIndex + ddd) * 100;
            container.current.style.paddingLeft = `${(leftIndex + ddd) * 100}px`;

            setLeftIndex(i => i + ddd);
            setRightIndex(r => r + ddd);
        }

    }*/

    // i would prefer to have the scrol value as ref? and just set the left and right indexes and the css set by the ref
    // this way we update the view less frequently

    // console.log(`render ${scrollLeft}`);

    return <div ref={container}
                className='numbers-grid-container'
                // style={{ paddingLeft: '300px' }}
                >
        <div className='numbers-grid' style={{ gridTemplateColumns: `repeat(${rightIndex - leftIndex}, 1fr)` }}>
            {
                // <GridCell val={''} header='both' />
            }
            {
                [
                    // ...headerRow
                ]
            }
            {
                /*cells.cells.map(row => {
                    row.map(cell => <GridCell key={cell} val={cell}/>)
                })*/
                // 65
                cells.cells.map((row, id) => <React.Fragment key={id}>
                    {
                        // <GridCell key={`Header ${id + 1}`} header='left' val={`Header ${id + 1}`}/>
                        row.slice(leftIndex, rightIndex).map((cell, idx) => {
                            const col = idx + 1 + leftIndex;
                            // const col = String.fromCharCode(idx + 65);
                            return <GridCell key={`${col}${id + 1}`} val={`${col} / ${id + 1}`}/>;
                        })
                    }
                </React.Fragment>)
            }
        </div>
    </div>
}


function App() {

    return <Grid />
}

export default App;
