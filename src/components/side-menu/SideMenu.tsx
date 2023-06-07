import React, {memo, useRef, useState} from "react";
import Button from "@mui/material/Button";
import {Add} from "@mui/icons-material";
import "./SideMenu.css"
import {ColorBubble, THEME_COLORS} from "../../models/color.model";

const SideMenu = memo(function({ bubbleClick = () => {} }: { bubbleClick: (colorBubble: ColorBubble) => void }) {
    const BUBBLE_FRAME_TIME = 85;
    const rawAnimation = [
        {transform: "translateY(0)", easing: "ease-out"},
        ...THEME_COLORS.map((_, i) => ({
            transform: `translateY(${20 + (i + 1) * 36}px)`,
        })),
    ];
    const colors = THEME_COLORS.reverse();
    const [showColors, setShowColors] = useState(false);
    const bubbles = useRef<HTMLElement[]>([]);

    const toggle = () => {
        animate(!showColors);
        setShowColors(!showColors);
    }

    const animate = (show: boolean) => {
        const easing = showColors ? "ease-out" : 'ease-in';
        const animation = rawAnimation.map(anim => ({...anim, easing}));
        (showColors ? bubbles.current : bubbles.current.reverse()).forEach((bubble, i) => {
            bubble.animate(animation.slice(0, i + 2), {
                duration: BUBBLE_FRAME_TIME * (i + 1),
                delay: show ? 0 : BUBBLE_FRAME_TIME * (bubbles.current.length - i),
                fill: "forwards",
                direction: show ? "normal" : "reverse",
            });
        });
        bubbles.current = [];
    }

    return <div className='side-menu'>
        <div className='flex-column relative'>
            <Button variant='contained' className="z1" onClick={toggle}>
                <Add />
            </Button>
            {
                colors.map(color => <div key={color.id}
                                         ref={elem => elem ? bubbles.current.push(elem!) : null}
                                         className="color-bubble absolute pointer"
                                         style={{ background: color.color }}
                                         onClick={event => bubbleClick({ color, event })}
                />)
            }
            <span className="test">More</span>
        </div>
    </div>
});



export default SideMenu;
