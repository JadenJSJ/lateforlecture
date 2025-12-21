"use client";

import { useState, useEffect } from "react";
import { Obstacle } from "@/lib/gameState";

interface CharacterProps {
    isRunning: boolean;
    isStumbling: boolean;
    isSpeedingUp: boolean;
    obstacle?: Obstacle | null;
}

export function Character({ isRunning, isStumbling, isSpeedingUp, obstacle }: CharacterProps) {
    const [bgOffset, setBgOffset] = useState(0);

    useEffect(() => {
        if (!isRunning) return;
        const interval = setInterval(() => setBgOffset((prev) => (prev + 2) % 100), 50);
        return () => clearInterval(interval);
    }, [isRunning]);

    return (
        <div className="relative w-full h-32 md:h-48 bg-gradient-to-b from-sky-300 to-emerald-200 rounded-xl overflow-hidden shadow-inner">
            <div className="absolute inset-0 flex items-end" style={{ transform: `translateX(-${bgOffset}px)` }}>
                {[...Array(15)].map((_, i) => (
                    <div key={i} className="flex-shrink-0 flex flex-col items-center justify-end mx-8" style={{ width: "60px" }}>
                        {i % 3 === 0 ? <span className="text-3xl md:text-4xl">🌳</span> : i % 3 === 1 ? <span className="text-2xl md:text-3xl">🏢</span> : <span className="text-xl md:text-2xl">🚲</span>}
                    </div>
                ))}
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-8 md:h-12 bg-gradient-to-t from-amber-200 to-amber-100" />

            <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-10">
                <div className={`text-4xl md:text-6xl transition-all duration-300 ${isStumbling ? "animate-stumble text-red-500" : isSpeedingUp ? "animate-speed scale-110" : isRunning ? "animate-run" : ""}`}>🏃</div>
                {isSpeedingUp && <div className="absolute left-0 top-1/2 -translate-x-8 -translate-y-1/2"><span className="text-xl md:text-2xl">💨</span></div>}
            </div>

            {obstacle && isStumbling && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-500/20 z-20">
                    <div className="bg-white/90 rounded-2xl p-4 md:p-6 shadow-xl animate-bounce">
                        <div className="text-4xl md:text-5xl mb-2 text-center">{obstacle.emoji}</div>
                        <div className="text-lg md:text-xl font-bold text-red-600 text-center">{obstacle.message}</div>
                        <div className="text-xs md:text-sm text-slate-500 text-center">{obstacle.english}</div>
                    </div>
                </div>
            )}

            <div className="absolute top-2 md:top-4 right-4 md:right-8 text-2xl md:text-4xl animate-pulse">☀️</div>
            <div className="absolute top-4 md:top-8 left-8 md:left-12 text-lg md:text-2xl opacity-70">☁️</div>
        </div>
    );
}
