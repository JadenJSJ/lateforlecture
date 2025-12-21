"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GameState } from "@/lib/gameState";
import { getMissedVocabulary } from "@/lib/questions";
import { useState } from "react";

interface LoseScreenProps {
    gameState: GameState;
    onPlayAgain: () => void;
}

export function LoseScreen({ gameState, onPlayAgain }: LoseScreenProps) {
    const [showReview, setShowReview] = useState(false);
    const missedVocab = getMissedVocabulary(gameState.answeredQuestions);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-400 via-slate-300 to-slate-200 flex flex-col items-center justify-center p-4">
            <Card className="relative z-10 max-w-lg w-full bg-white/95 backdrop-blur-sm shadow-2xl border-0">
                <CardContent className="p-6 md:p-8 text-center">
                    <div className="text-5xl md:text-6xl mb-4">😅</div>
                    <h1 className="text-3xl md:text-4xl font-bold text-red-600 mb-2">太晚了!</h1>
                    <p className="text-lg md:text-xl text-slate-600 mb-4">下课了...</p>

                    <div className="text-5xl md:text-7xl mb-6">
                        <span className="inline-block opacity-50">🏃</span>
                        <span className="mx-2 md:mx-4 text-xl md:text-2xl">...</span>
                        <span className="text-4xl md:text-6xl opacity-40">🏛️</span>
                    </div>

                    <div className="bg-slate-100 rounded-xl p-3 md:p-4 mb-6 border-2 border-dashed border-slate-300">
                        <p className="text-base md:text-lg text-slate-600">讲座九点开始,现在十点,下课了!</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6">
                        <div className="bg-slate-50 rounded-xl p-3 md:p-4">
                            <div className="text-2xl md:text-3xl font-bold text-slate-600">{gameState.score}</div>
                            <div className="text-xs md:text-sm text-slate-500">Final Score</div>
                        </div>
                        <div className="bg-red-50 rounded-xl p-3 md:p-4">
                            <div className="text-xl md:text-2xl font-bold text-red-600">{gameState.currentQuestionIndex + 1}/{gameState.totalQuestions}</div>
                            <div className="text-xs md:text-sm text-slate-500">Questions</div>
                        </div>
                    </div>

                    <div className="bg-amber-50 rounded-xl p-3 md:p-4 mb-6">
                        <p className="text-slate-700 text-sm md:text-base">💪 Don&apos;t give up! 坚持就是胜利!</p>
                    </div>

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

                    <Button onClick={onPlayAgain} size="lg" className="w-full py-5 md:py-6 text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg">
                        再试一会儿! <span className="ml-2 text-base md:text-lg">(Try Again)</span>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
