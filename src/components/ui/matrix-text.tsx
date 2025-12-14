"use client";

import { useEffect, useState, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MatrixTextProps {
    children: ReactNode;
    className?: string;
    speed?: number;
}

export function MatrixText({ children, className, speed = 50 }: MatrixTextProps) {
    const [displayText, setDisplayText] = useState("");
    const chars = "01";

    // Extract text from children and preserve all whitespace
    const text = typeof children === 'string' ? children : String(children);

    useEffect(() => {
        let iteration = 0;
        const interval = setInterval(() => {
            setDisplayText(
                text
                    .split("")
                    .map((char, index) => {
                        // Preserve all whitespace characters
                        if (char === " " || char === "\n" || char === "\t") return char;
                        if (index < iteration) {
                            return text[index];
                        }
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join("")
            );

            if (iteration >= text.length) {
                clearInterval(interval);
            }

            iteration += 1 / 3;
        }, speed);

        return () => clearInterval(interval);
    }, [text, speed]);

    return (
        <span className={cn("inline", className)} style={{ whiteSpace: 'pre-wrap' }}>
            {displayText.split("").map((char, index) => {
                const isDecoded = text[index] === char;
                const isWhitespace = char === " " || char === "\n" || char === "\t";

                return (
                    <span
                        key={index}
                        className={cn(
                            "inline",
                            !isDecoded && !isWhitespace && "text-green-500 font-mono"
                        )}
                    >
                        {char}
                    </span>
                );
            })}
        </span>
    );
}
