"use client";

import { useState, useEffect, useCallback } from "react";
import { TimeDisplay } from "./TimeDisplay";
import { ProgressBar } from "./ProgressBar";
import { Character } from "./Character";
import { QuestionCard } from "./QuestionCard";
import { FeedbackAlert } from "./FeedbackAlert";
import { GameState, Obstacle, calculateSpeedBonus, calculateStreakBonus } from "@/lib/gameState";
import { feedbackMessages, obstacles } from "@/lib/vocabulary";

interface GameScreenProps {
    gameState: GameState;
    onGameStateChange: (update: Partial<GameState> | ((prev: GameState) => GameState)) => void;
}

export function GameScreen({ gameState, onGameStateChange }: GameScreenProps) {
    const [isRunning, setIsRunning] = useState(true);
    const [isStumbling, setIsStumbling] = useState(false);
    const [isSpeedingUp, setIsSpeedingUp] = useState(false);
    const [currentObstacle, setCurrentObstacle] = useState<Obstacle | null>(null);
    const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string; scoreGained?: number; streak?: number } | null>(null);
    const [isAnswering, setIsAnswering] = useState(false);

    const currentQuestion = gameState.questions[gameState.currentQuestionIndex];

    useEffect(() => {
        if (currentQuestion && gameState.questionStartTime === 0) {
            onGameStateChange({ questionStartTime: Date.now() });
        }
    }, [currentQuestion, gameState.questionStartTime, onGameStateChange]);

    const handleAnswer = useCallback((answer: string) => {
        if (isAnswering || !currentQuestion) return;
        setIsAnswering(true);
        setIsRunning(false);

        const timeToAnswer = Date.now() - gameState.questionStartTime;
        const isCorrect = currentQuestion.correctAnswers.includes(answer);

        if (isCorrect) {
            const baseScore = 100;
            const speedBonus = calculateSpeedBonus(timeToAnswer);
            const newStreak = gameState.streak + 1;
            const streakBonus = calculateStreakBonus(newStreak);
            const totalScore = baseScore + speedBonus + streakBonus;

            const successMessage = feedbackMessages.correct[Math.floor(Math.random() * feedbackMessages.correct.length)];
            setIsSpeedingUp(true);
            setFeedback({ isCorrect: true, message: successMessage, scoreGained: totalScore, streak: newStreak });

            onGameStateChange((prev) => ({
                ...prev,
                score: prev.score + totalScore,
                streak: newStreak,
                bestStreak: Math.max(prev.bestStreak, newStreak),
                progress: Math.min(100, ((prev.currentQuestionIndex + 1) / prev.totalQuestions) * 100),
                answeredQuestions: [...prev.answeredQuestions, { ...currentQuestion, selectedAnswer: answer, isCorrect, timeToAnswer }],
            }));
        } else {
            const obstacle = obstacles[Math.floor(Math.random() * obstacles.length)];
            const failMessage = feedbackMessages.wrong[Math.floor(Math.random() * feedbackMessages.wrong.length)];

            setIsStumbling(true);
            setCurrentObstacle(obstacle);
            setFeedback({ isCorrect: false, message: failMessage });

            onGameStateChange((prev) => {
                const newTime = prev.currentTime + prev.timePenalty;
                return {
                    ...prev,
                    currentTime: newTime,
                    streak: 0,
                    answeredQuestions: [...prev.answeredQuestions, { ...currentQuestion, selectedAnswer: answer, isCorrect, timeToAnswer }],
                    screen: newTime >= prev.targetTime ? "lose" : prev.screen,
                };
            });
        }
    }, [isAnswering, currentQuestion, gameState.questionStartTime, gameState.streak, onGameStateChange]);

    const handleFeedbackComplete = useCallback(() => {
        setFeedback(null);
        setIsStumbling(false);
        setIsSpeedingUp(false);
        setCurrentObstacle(null);
        setIsRunning(true);
        setIsAnswering(false);

        onGameStateChange((prev) => {
            if (prev.currentTime >= prev.targetTime) return { ...prev, screen: "lose" };
            const nextIndex = prev.currentQuestionIndex + 1;
            if (nextIndex >= prev.totalQuestions) return { ...prev, screen: "win", progress: 100 };
            return { ...prev, currentQuestionIndex: nextIndex, questionStartTime: Date.now() };
        });
    }, [onGameStateChange]);

    if (!currentQuestion) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-gradient-to-b from-sky-400 via-sky-300 to-emerald-200 p-3 md:p-4">
            <div className="max-w-4xl mx-auto space-y-3 md:space-y-4">
                <div className="flex justify-between items-center gap-2">
                    <div className="inline-flex items-center gap-1.5 text-sm md:text-lg font-bold px-3 md:px-5 py-1.5 md:py-2.5 rounded-full bg-slate-800 text-white shadow-lg">
                        <span>🏆</span><span>Score: {gameState.score}</span>
                    </div>
                    {gameState.streak > 0 && (
                        <div className="inline-flex items-center gap-1.5 text-sm md:text-lg font-bold px-3 md:px-5 py-1.5 md:py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg">
                            <span>🔥</span><span>Streak: {gameState.streak}</span>
                        </div>
                    )}
                </div>

                <TimeDisplay currentTime={gameState.currentTime} targetTime={gameState.targetTime} />
                <ProgressBar progress={gameState.progress} questionNumber={gameState.currentQuestionIndex + 1} totalQuestions={gameState.totalQuestions} />
                <Character isRunning={isRunning} isStumbling={isStumbling} isSpeedingUp={isSpeedingUp} obstacle={currentObstacle} />
                <QuestionCard question={currentQuestion} onAnswer={handleAnswer} disabled={isAnswering} showPinyinDefault={gameState.showPinyin} />
            </div>

            {feedback && <FeedbackAlert isCorrect={feedback.isCorrect} message={feedback.message} scoreGained={feedback.scoreGained} streak={feedback.streak} onComplete={handleFeedbackComplete} />}
        </div>
    );
}
