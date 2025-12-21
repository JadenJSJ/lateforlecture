"use client";

import { useEffect, useState } from "react";

interface FeedbackAlertProps {
    isCorrect: boolean;
    message: string;
    scoreGained?: number;
    streak?: number;
    onComplete: () => void;
}

export function FeedbackAlert({ isCorrect, message, scoreGained, streak, onComplete }: FeedbackAlertProps) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onComplete, 300);
        }, 1500);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}>
            <div className={`absolute inset-0 ${isCorrect ? "bg-emerald-500/20" : "bg-red-500/20"}`} />
            <div className={`relative p-6 md:p-8 rounded-2xl shadow-2xl transform transition-all duration-300 ${visible ? "scale-100" : "scale-90"} ${isCorrect ? "bg-emerald-500" : "bg-red-500"}`}>
                <div className="text-5xl md:text-6xl text-center mb-4">{isCorrect ? "🎉" : "😅"}</div>
                <div className="text-2xl md:text-3xl font-bold text-white text-center mb-2">{message}</div>
                {isCorrect && scoreGained && (
                    <div className="flex justify-center gap-3 md:gap-4 mt-4">
                        <span className="bg-white/20 text-white text-base md:text-lg px-3 md:px-4 py-1.5 md:py-2 rounded-full">+{scoreGained} points</span>
                        {streak && streak > 1 && <span className="bg-yellow-400 text-yellow-900 text-base md:text-lg px-3 md:px-4 py-1.5 md:py-2 rounded-full">🔥 {streak} streak!</span>}
                    </div>
                )}
                {!isCorrect && <div className="text-white/80 text-center mt-2 text-sm md:text-base">⏰ Time penalty added</div>}
            </div>
        </div>
    );
}
