"use client";

import { useState, useCallback } from "react";
import { TitleScreen, GameScreen, WinScreen, LoseScreen } from "@/components/game";
import { GameState, createInitialGameState, Difficulty, difficultySettings } from "@/lib/gameState";
import { generateQuestions } from "@/lib/questions";

export default function Home() {
    const [gameState, setGameState] = useState<GameState>(createInitialGameState());

    const handleStart = useCallback((difficulty: Difficulty) => {
        const settings = difficultySettings[difficulty];
        const questions = generateQuestions(settings.totalQuestions);
        const initialState = createInitialGameState(difficulty);
        setGameState({
            ...initialState,
            screen: "playing",
            questions,
            questionStartTime: Date.now(),
        });
    }, []);

    const handlePlayAgain = useCallback(() => {
        setGameState(createInitialGameState());
    }, []);

    const handleGameStateChange = useCallback(
        (update: Partial<GameState> | ((prev: GameState) => GameState)) => {
            setGameState((prev) => {
                if (typeof update === "function") {
                    return update(prev);
                }
                return { ...prev, ...update };
            });
        },
        []
    );

    // Render appropriate screen based on game state
    switch (gameState.screen) {
        case "title":
            return <TitleScreen onStart={handleStart} />;

        case "playing":
            return (
                <GameScreen
                    gameState={gameState}
                    onGameStateChange={handleGameStateChange}
                />
            );

        case "win":
            return <WinScreen gameState={gameState} onPlayAgain={handlePlayAgain} />;

        case "lose":
            return <LoseScreen gameState={gameState} onPlayAgain={handlePlayAgain} />;

        default:
            return <TitleScreen onStart={handleStart} />;
    }
}