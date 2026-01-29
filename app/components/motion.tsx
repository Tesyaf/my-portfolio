"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { PropsWithChildren } from "react";

export function useMotionDefaults() {
    const reduce = useReducedMotion();
    const dur = reduce ? 0 : 0.65;

    return {
        reduce,
        transition: { duration: dur, ease: [0.16, 1, 0.3, 1] as const },
    };
}

export function Stagger({
    children,
    className,
    delay = 0,
    stagger = 0.08,
    once = true,
}: PropsWithChildren<{
    className?: string;
    delay?: number;
    stagger?: number;
    once?: boolean;
}>) {
    const { reduce, transition } = useMotionDefaults();

    const variants = {
        hidden: {},
        show: {
            transition: reduce
                ? undefined
                : {
                    ...transition,
                    delayChildren: delay,
                    staggerChildren: stagger,
                },
        },
    };

    return (
        <motion.div
            className={className}
            variants={variants}
            initial="hidden"
            whileInView="show"
            viewport={{ once, amount: 0.2 }}
        >
            {children}
        </motion.div>
    );
}

export function FadeUp({
    children,
    className,
    y = 18,
    once = true,
    delay = 0,
}: PropsWithChildren<{
    className?: string;
    y?: number;
    delay?: number;
    once?: boolean;
}>) {
    const { reduce, transition } = useMotionDefaults();

    const variants = {
        hidden: { opacity: 0, y: reduce ? 0 : y, filter: "blur(6px)" },
        show: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: reduce ? undefined : { ...transition, delay },
        },
    };

    return (
        <motion.div
            className={className}
            variants={variants}
            initial="hidden"
            whileInView="show"
            viewport={{ once, amount: 0.2 }}
        >
            {children}
        </motion.div>
    );
}

export function FadeIn({
    children,
    className,
    once = true,
    delay = 0,
}: PropsWithChildren<{ className?: string; once?: boolean; delay?: number }>) {
    const { reduce, transition } = useMotionDefaults();

    return (
        <motion.div
            className={className}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={reduce ? undefined : { ...transition, delay }}
            viewport={{ once, amount: 0.2 }}
        >
            {children}
        </motion.div>
    );
}

export function ScaleIn({
    children,
    className,
    once = true,
    delay = 0,
}: PropsWithChildren<{ className?: string; once?: boolean; delay?: number }>) {
    const { reduce, transition } = useMotionDefaults();

    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, scale: reduce ? 1 : 0.96, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={reduce ? undefined : { ...transition, delay }}
            viewport={{ once, amount: 0.2 }}
        >
            {children}
        </motion.div>
    );
}
