import Card from "@mui/material/Card";
import React, {ForwardedRef, forwardRef, memo, useEffect, useRef, useState} from "react";
import {Note, NoteStates} from "../../models/note.model";
import "./NotesList.css"
import {CardContent, Typography} from "@mui/material";
import useResize from "../utils/resize";
import { getContrastColor } from "../../models/color.model";


const MAX_COLS = 10;
const GRID_PADDING = 10;
export const NOTE_WIDTH = 250;

export type Position = [number, number];
export type Layout = Position[];
type AllLayouts = Layout[];
type ColumnsHeight = number[];

class GridService {
    public pos = 0;

    public cols = 1;
    private layouts: AllLayouts = [];
    private columnHeights: ColumnsHeight[] = [];

    constructor() {
        console.log('constructor');
    }

    public get layout(): Layout {
        return this.layouts[this.cols - 1];
    }

    public gridChanged(width: number): void {
        this.cols = Math.min(Math.max(Math.floor(width / NOTE_WIDTH), 1), MAX_COLS);
        this.pos = Math.max(Math.floor((width - (GRID_PADDING + this.cols * NOTE_WIDTH)) / 2), 0);
    }

    public relayout(notes: HTMLElement[]): void {
        const len = notes.length;
        for (let i = 0;i < 10;i++) {
            this.columnHeights[i] = [...Array(i + 1)].map(() => 100);
            const res: Layout = [];
            const colHeights = this.columnHeights[i];
            for (let n = 0; n < len; n++) {
                const min = Math.min(...colHeights);
                const idx = colHeights.indexOf(min);
                res.push([idx * NOTE_WIDTH, min]);
                colHeights[idx] += notes[n].clientHeight;
            }
            this.layouts[i] = res;
        }
    }
}

export const gridService = new GridService();

const NoteListItem = memo(function ({ note }: { note: Note }) {
    const background = note?.color || '#ffffff';
    const color = getContrastColor(background) || '#000000';

    return <div className='note no-select note-container'>
        <Card style={{ background, color }}>
            <CardContent>
                <Typography variant="h5" component="div">{ note.title }</Typography>
                <Typography variant="body1">{ note.content }</Typography>
            </CardContent>
        </Card>
        <div className="overlay"></div>
    </div>
})

function getNotePos(position: Position, offset = 0): string {
    return `translate3d(${position[0] + gridService.pos}px, ${position[1] + offset}px, 0px)`;
}

function getLoadAnimation(position: Position): Keyframe[] {
    return [
        {
            opacity: 0,
            transform: getNotePos(position, 25),
        },
        {
            opacity: 1,
            transform: getNotePos(position),
        }
    ];
}

function noteStylesAfterAnimation(note: HTMLElement, delay = 0): void {
    note.style.opacity = "1";
    note.style.transitionDelay = `${delay}ms`;
}

function NotesList({ notes }: { notes: Note[] }) {
    const container = useRef<HTMLDivElement>(null);
    const width = useResize(container, 300);

    const layoutAnimation = (notes: Note[] = []) => {
        const len = container.current?.children.length || 0;
        const loadedIdx: number[] = [];
        for (let i = 0; i < len; i++) {
            noteAnimation(i, gridService.layout[i], loadedIdx, notes[i]);
        }
    }

    useEffect(() => {
        gridService.gridChanged(width);
    }, [width]);

    useEffect(() => {
        if (container.current?.children) {
            gridService.relayout([...container.current.children] as HTMLElement[]);
            layoutAnimation(notes);
        }
    }, [width, notes]);

    const noteAnimation = (i: number, pos: Position, loadedIdx: number[], note?: Note) => {
        const noteElem = container.current?.children[i] as HTMLElement;
        noteElem.style.transform = getNotePos(pos);

        if (note?.state === NoteStates.LOADING) {


            // loadedIdx.push(i);
            noteElem.style.transform = getNotePos(pos);
            noteElem.animate(getLoadAnimation(pos), {
                duration: 250,
                delay: i * 15,
            }).onfinish = () => {
                noteStylesAfterAnimation(noteElem, i * 5);
                if (note?.loadingLast) {
                    // this.store.dispatch(loadNotesAnimation({ids: loadedIdx}));
                }
            }
        }
        // console.log(getNotePos(pos));
        /*this.animating = true;
        const noteElem = this.notes.get(i)!.elem;
        if (note?.state === NoteStates.LOADING) {
            loadedIdx.push(i);
            noteElem.style.transform = this.getNotePos(pos);
            noteElem.animate(this.getLoadAnimation(pos), {
                duration: 250,
                delay: i * 15,
            }).onfinish = () => {
                this.noteStylesAfterAnimation(noteElem, i * 5);
                if (note?.loadingLast) {
                    this.store.dispatch(loadNotesAnimation({ids: loadedIdx}));
                }
            }
        } else if (note?.state === NoteStates.CREATING) {
            noteElem.style.transform = `translate3d(${pos[0] + this.gridService.pos}px, ${pos[1]}px, 0px)`;
            noteElem.firstElementChild!.firstElementChild!.animate(this.childCreateAnimation, {duration: 250, delay: 200});
            noteElem.animate(this.createAnimation, {duration: 250, delay: 200}).onfinish = () => {
                this.store.dispatch(addNoteAnimation({id: i}));
                this.noteStylesAfterAnimation(noteElem);
            };
        } else if(note?.state === NoteStates.DRAGGING) {
            this.dragOptions = {
                pos,
                size: [250, noteElem.clientHeight],
            }
            this.cdr.markForCheck();
        } else {
            // no need to animate all of them, only a portion, others go directly
            noteElem.style.transform = this.getNotePos(pos);
            setTimeout(() => {
                this.animating = false;
            }, 150);
        }*/
    }

    console.log('render');

    return <div ref={container} className='notes notes-container'>
        {
            notes.map(note => <NoteListItem key={note.id}
                                            note={note} />)
        }
    </div>
}

export default NotesList;
