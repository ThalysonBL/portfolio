import { motion } from "framer-motion";

interface SplitTextProps {
    text: string;
    delay?: number;
    initial?: "hidden" | "show";
    animate?: "hidden" | "show";
}

const SplitText = ({
    text,
    delay = 0,
    initial = "hidden",
    animate = "show",
}: SplitTextProps) => {
    const letters = text.split("");

    const container = {
        hidden: {},
        show: {
            transition: {
                staggerChildren: 0.04,
                delayChildren: delay,
            },
        },
    };

    const child = {
        hidden: { y: 40, opacity: 0 },
        show: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5, ease: "easeOut" as const },
        },
    };

    return (
        <motion.div
            className="flex flex-wrap overflow-hidden"
            variants={container}
            initial={initial}
            animate={animate}
        >
            {letters.map((char, index) => (
                <motion.span
                    key={index}
                    variants={child}
                    className="inline-block"
                >
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </motion.div>
    );
};

export default SplitText;
