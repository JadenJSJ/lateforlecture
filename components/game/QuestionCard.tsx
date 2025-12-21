"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Question } from "@/lib/gameState";
import { useState } from "react";

interface QuestionCardProps {
    question: Question;
    onAnswer: (answer: string) => void;
    disabled: boolean;
    showPinyinDefault?: boolean;
}

export function QuestionCard({ question, onAnswer, disabled, showPinyinDefault = false }: QuestionCardProps) {
    const [showPinyin, setShowPinyin] = useState(showPinyinDefault);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

    const handleAnswer = (answer: string) => {
        if (disabled) return;
        setSelectedAnswer(answer);
        onAnswer(answer);
    };

    const getQuestionTypeLabel = () => {
        const labels: Record<string, string> = {
            timeReading: "🕐 Time Reading",
            chineseToEnglish: "🀄 Chinese → English",
            englishToChinese: "🔤 English → Chinese",
            fillBlank: "✏️ Fill in the Blank",
            timeConstruction: "🔢 Time Construction",
            sentenceComplete: "📝 Complete the Sentence",
        };
        return labels[question.type] || "❓ Question";
    };

    return (
        <Card className="w-full bg-white/95 backdrop-blur-sm shadow-xl border-0">
            <CardHeader className="pb-2 px-4 md:px-6">
                <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">{getQuestionTypeLabel()}</Badge>
                    {question.pinyin && (
                        <button onClick={() => setShowPinyin(!showPinyin)} className="text-xs text-slate-500 hover:text-emerald-600 transition-colors">
                            {showPinyin ? "Hide" : "Show"} pinyin
                        </button>
                    )}
                </div>
                <CardTitle className="text-xl md:text-2xl text-center pt-4">
                    {question.displayElement && (
                        <div className="mb-4">
                            {question.type === "timeReading" ? (
                                <div className="text-4xl md:text-6xl font-mono bg-slate-100 rounded-xl py-3 md:py-4 px-6 md:px-8 inline-block shadow-inner">🕐 {question.displayElement}</div>
                            ) : question.type === "fillBlank" ? (
                                <div className="text-2xl md:text-4xl text-slate-700 font-medium">
                                    {question.displayElement.split("___").map((part, i, arr) => (
                                        <span key={i}>{part}{i < arr.length - 1 && <span className="inline-block w-12 md:w-16 border-b-4 border-emerald-400 mx-1" />}</span>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-2xl md:text-3xl text-slate-700">{question.displayElement}</div>
                            )}
                        </div>
                    )}
                    <div className="text-slate-800">{question.prompt}</div>
                    {showPinyin && question.pinyin && <div className="text-base md:text-lg text-emerald-600 font-normal mt-2">{question.pinyin}</div>}
                </CardTitle>
            </CardHeader>

            <CardContent className="pt-4 px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                    {question.answers.map((answer, index) => (
                        <Button
                            key={index}
                            onClick={() => handleAnswer(answer)}
                            disabled={disabled}
                            variant={selectedAnswer === answer ? "default" : "outline"}
                            className={`py-4 md:py-6 text-lg md:text-xl font-medium transition-all duration-200 hover:scale-[1.02] ${disabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg hover:border-emerald-400"} ${selectedAnswer === answer ? "bg-slate-700 text-white" : "bg-white hover:bg-emerald-50"}`}
                        >
                            <span className="mr-2 text-slate-400 text-base md:text-lg">{String.fromCharCode(65 + index)}.</span>
                            {answer}
                        </Button>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
