"use client";

import { formatTime } from "@/lib/gameState";

interface TimeDisplayProps {
    currentTime: number;
    targetTime: number;
}

export function TimeDisplay({ currentTime, targetTime }: TimeDisplayProps) {
    const isLate = currentTime >= targetTime;
    const timeRemaining = targetTime - currentTime;
    const isUrgent = timeRemaining <= 15;

    return (
        <div className="flex flex-wrap items-center justify-between gap-2 md:gap-4 px-4 md:px-6 py-3 md:py-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
            <div className="flex items-center gap-2 md:gap-3">
                <span className="text-sm md:text-lg text-slate-600 font-medium">现在几点?</span>
                <div className={`inline-flex items-center gap-1.5 text-base md:text-xl font-mono font-semibold px-3 md:px-5 py-1.5 md:py-2.5 rounded-full shadow-md transition-all ${isLate ? "bg-red-500 text-white animate-pulse" : isUrgent ? "bg-amber-500 text-white" : "bg-slate-800 text-white"}`}>
                    <span className="text-sm md:text-lg">🕐</span>
                    <span>{formatTime(currentTime)}</span>
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
                <span className="text-sm md:text-lg text-slate-600 font-medium">讲座开始:</span>
                <div className="inline-flex items-center gap-1.5 text-base md:text-xl font-mono font-semibold px-3 md:px-5 py-1.5 md:py-2.5 rounded-full border-2 border-emerald-500 text-emerald-700 bg-emerald-50 shadow-md">
                    <span className="text-sm md:text-lg">🎯</span>
                    <span>{formatTime(targetTime)}</span>
                </div>
            </div>

            {!isLate && (
                <div className="w-full text-center mt-1 md:mt-2">
                    <span className={`text-xs md:text-sm font-medium ${isUrgent ? "text-red-500 font-bold" : "text-slate-500"}`}>
                        {isUrgent ? "⚠️ " : ""}{timeRemaining} minutes remaining!{isUrgent ? " 快点!" : ""}
                    </span>
                </div>
            )}
        </div>
    );
}
