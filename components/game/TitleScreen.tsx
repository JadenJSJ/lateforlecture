"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Difficulty, difficultySettings } from "@/lib/gameState";

interface TitleScreenProps {
    onStart: (difficulty: Difficulty) => void;
}

export function TitleScreen({ onStart }: TitleScreenProps) {
    const [bounce, setBounce] = useState(false);
    const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("medium");

    useEffect(() => {
        const interval = setInterval(() => setBounce((prev) => !prev), 500);
        return () => clearInterval(interval);
    }, []);

    const difficulties: Difficulty[] = ["easy", "medium", "hard"];

    return (
        <div className="min-h-screen bg-gradient-to-b from-sky-400 via-sky-300 to-emerald-200 flex flex-col items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 text-4xl md:text-6xl opacity-50 animate-pulse">🏛️</div>
                <div className="absolute top-20 right-20 text-3xl md:text-4xl opacity-40">🌳</div>
                <div className="absolute bottom-40 left-20 text-2xl md:text-3xl opacity-30">🚲</div>
            </div>

            <Card className="relative z-10 max-w-md w-full bg-white/90 backdrop-blur-sm shadow-2xl border-0">
                <CardContent className="p-6 md:p-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-red-600 mb-2 drop-shadow-lg">迟到了!</h1>
                    <h2 className="text-xl md:text-2xl font-semibold text-slate-700 mb-3">Late for Lecture!</h2>
                    <p className="text-base md:text-lg text-slate-500 mb-1">一个大学生的早上</p>
                    <p className="text-xs md:text-sm text-slate-400 mb-6 italic">A university student&apos;s morning</p>

                    <div className="text-5xl md:text-7xl mb-6">
                        <span className={`inline-block transition-transform duration-200 ${bounce ? "translate-y-[-8px] rotate-[-5deg]" : "translate-y-0 rotate-[5deg]"}`}>🏃</span>
                        <span className="ml-2 text-3xl md:text-4xl">💨</span>
                    </div>

                    <div className="mb-6">
                        <p className="text-sm text-slate-500 mb-3">选择难度 (Select Difficulty)</p>
                        <div className="grid grid-cols-3 gap-2">
                            {difficulties.map((diff) => {
                                const settings = difficultySettings[diff];
                                const isSelected = selectedDifficulty === diff;
                                return (
                                    <button
                                        key={diff}
                                        onClick={() => setSelectedDifficulty(diff)}
                                        className={`p-2 md:p-3 rounded-lg border-2 transition-all text-center ${isSelected ? "border-emerald-500 bg-emerald-50 shadow-md" : "border-slate-200 bg-white hover:border-slate-300"}`}
                                    >
                                        <div className={`text-sm md:text-base font-bold ${isSelected ? "text-emerald-600" : "text-slate-700"}`}>{settings.nameZh}</div>
                                        <div className="text-xs text-slate-500">{settings.name}</div>
                                        <div className="text-xs text-slate-400 mt-1 hidden md:block">{settings.totalQuestions} questions</div>
                                    </button>
                                );
                            })}
                        </div>
                        <p className="text-xs text-slate-400 mt-2">{difficultySettings[selectedDifficulty].description}</p>
                    </div>

                    <p className="text-xs md:text-sm text-slate-600 mb-6">Answer questions correctly to reach your <span className="font-bold text-emerald-600">讲座</span> on time!</p>

                    <Button onClick={() => onStart(selectedDifficulty)} size="lg" className="w-full py-5 md:py-6 text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        开始! <span className="ml-2 text-base md:text-lg">(Start!)</span>
                    </Button>
                </CardContent>
            </Card>
            <p className="mt-6 text-slate-600 text-xs md:text-sm relative z-10">Chapter 6: Time & University Life</p>
        </div>
    );
}
