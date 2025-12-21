"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatTimeInChinese, GameState } from "@/lib/gameState";
import { getMissedVocabulary } from "@/lib/questions";
import { useState } from "react";

interface WinScreenProps {
    gameState: GameState;
    onPlayAgain: () => void;
}

export function WinScreen({ gameState, onPlayAgain }: WinScreenProps) {
    const [showReview, setShowReview] = useState(false);
    const isPerfect = gameState.answeredQuestions.every((q) => q.isCorrect);
    const missedVocab = getMissedVocabulary(gameState.answeredQuestions);
    const timeInChinese = formatTimeInChinese(gameState.currentTime);

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-400 via-teal-300 to-sky-200 flex flex-col items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div key={i} className="absolute text-2xl md:text-4xl animate-bounce" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 2}s` }}>
                        {["🎉", "✨", "🌟", "🎊"][i % 4]}
                    </div>
                ))}
            </div>

            <Card className="relative z-10 max-w-lg w-full bg-white/95 backdrop-blur-sm shadow-2xl border-0">
                <CardContent className="p-6 md:p-8 text-center">
                    {isPerfect ? (
                        <>
                            <div className="text-5xl md:text-6xl mb-4">🌟</div>
                            <h1 className="text-3xl md:text-4xl font-bold text-amber-600 mb-2">太早了!</h1>
                            <p className="text-lg md:text-xl text-slate-600 mb-4">你来得很早!</p>
                        </>
                    ) : (
                        <>
                            <div className="text-5xl md:text-6xl mb-4">🎉</div>
                            <h1 className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">太好了!</h1>
                            <p className="text-lg md:text-xl text-slate-600 mb-4">我们到了!</p>
                        </>
                    )}

                    <div className="text-5xl md:text-7xl mb-6">
                        <span className="inline-block animate-bounce">🏃</span>
                        <span className="mx-2 md:mx-4">→</span>
                        <span className="text-4xl md:text-6xl">🏛️</span>
                    </div>

                    <div className="bg-slate-100 rounded-xl p-3 md:p-4 mb-6">
                        <p className="text-base md:text-lg text-slate-600">👨‍🏫 早上好!讲座现在开始。</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6">
                        <div className="bg-emerald-50 rounded-xl p-3 md:p-4">
                            <div className="text-2xl md:text-3xl font-bold text-emerald-600">{gameState.score}</div>
                            <div className="text-xs md:text-sm text-slate-500">Final Score</div>
                        </div>
                        <div className="bg-sky-50 rounded-xl p-3 md:p-4">
                            <div className="text-xl md:text-2xl font-bold text-sky-600">{timeInChinese}</div>
                            <div className="text-xs md:text-sm text-slate-500">Arrival Time</div>
                        </div>
                    </div>

                    {isPerfect && <div className="bg-amber-100 rounded-xl p-3 md:p-4 mb-6"><p className="text-base md:text-lg font-bold text-amber-700">🌟 Perfect Bonus: +500 points!</p></div>}

                    {missedVocab.length > 0 && (
                        <div className="mb-6">
                            <Button variant="outline" onClick={() => setShowReview(!showReview)} className="mb-4">{showReview ? "Hide" : "Review"} Missed Words ({missedVocab.length})</Button>
                            {showReview && (
                                <div className="bg-red-50 rounded-xl p-3 md:p-4 text-left max-h-40 overflow-y-auto">
                                    {missedVocab.map((v) => <div key={v.id} className="flex justify-between py-2 border-b last:border-0"><span className="text-lg md:text-xl">{v.chinese}</span><span className="text-xs md:text-sm text-slate-500">{v.pinyin} - {v.english}</span></div>)}
                                </div>
                            )}
                        </div>
                    )}

                    <Button onClick={onPlayAgain} size="lg" className="w-full py-5 md:py-6 text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg">
                        {isPerfect ? "我们太厉害了!" : "明天见!"} <span className="ml-2 text-base md:text-lg">(Play Again)</span>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
