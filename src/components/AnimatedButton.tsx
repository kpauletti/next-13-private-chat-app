"use client";
import { motion as m, HTMLMotionProps } from "framer-motion";
import { twMerge } from "tailwind-merge";


export default function AnimatedButton(props: HTMLMotionProps<"button">) {

    const { className, ...restProps } = props;

    const classes = twMerge(
        `w-full bg-cyan-600 text-white py-2 px-3 font-bold select-none lg:text-2xl sm:text-sm`,
        className
    );

    return (
        <m.button
            initial={{ boxShadow: "10px 5px white" }}
            whileTap={{ x: 10, y: 5, boxShadow: "0px 0px white" }}
            className={classes}
            {...restProps}
        >
            {props.children}
        </m.button>
    );
}
