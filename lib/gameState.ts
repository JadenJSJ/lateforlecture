// Game state types and interfaces

export type GameScreen = "title" | "playing" | "win" | "lose";
export type Difficulty = "easy" | "medium" | "hard";

export type QuestionType =
    | "timeReading"
    | "chineseToEnglish"
    | "englishToChinese"
    | "fillBlank"
    | "timeConstruction"
    | "sentenceComplete";

export interface Question {
    id: number;
    type: QuestionType;
    prompt: string;
    displayElement?: string;
    answers: string[];
    correctAnswers: string[];
    vocabularyIds: number[];
    pinyin?: string;
}

export interface AnsweredQuestion extends Question {
    selectedAnswer: string;
    isCorrect: boolean;
    timeToAnswer: number;
}

export interface DifficultySettings {
    name: string;
    nameZh: string;
    description: string;
    totalQuestions: number;
    startTime: number;
    targetTime: number;
    timePenalty: number;
    showPinyin: boolean;
}

export const difficultySettings: Record<Difficulty, DifficultySettings> = {
    easy: {
        name: "Easy",
        nameZh: "简单",
        description: "More time, pinyin hints shown",
        totalQuestions: 8,
        startTime: 480,
        targetTime: 540,
        timePenalty: 3,
        showPinyin: true,
    },
    medium: {
        name: "Medium",
        nameZh: "中等",
        description: "Standard mode",
        totalQuestions: 10,
        startTime: 495,
        targetTime: 540,
        timePenalty: 5,
        showPinyin: false,
    },
    hard: {
        name: "Hard",
        nameZh: "困难",
        description: "Less time, more questions",
        totalQuestions: 15,
        startTime: 510,
        targetTime: 540,
        timePenalty: 5,
        showPinyin: false,
    },
};

export interface GameState {
    screen: GameScreen;
    difficulty: Difficulty;
    currentQuestionIndex: number;
    totalQuestions: number;
    score: number;
    streak: number;
    bestStreak: number;
    currentTime: number;
    targetTime: number;
    progress: number;
    questions: Question[];
    answeredQuestions: AnsweredQuestion[];
    questionStartTime: number;
    timePenalty: number;
    showPinyin: boolean;
}

export interface Obstacle {
    emoji: string;
    message: string;
    english: string;
}

export function createInitialGameState(difficulty: Difficulty = "medium"): GameState {
    const settings = difficultySettings[difficulty];
    return {
        screen: "title",
        difficulty,
        currentQuestionIndex: 0,
        totalQuestions: settings.totalQuestions,
        score: 0,
        streak: 0,
        bestStreak: 0,
        currentTime: settings.startTime,
        targetTime: settings.targetTime,
        progress: 0,
        questions: [],
        answeredQuestions: [],
        questionStartTime: 0,
        timePenalty: settings.timePenalty,
        showPinyin: settings.showPinyin,
    };
}

export function formatTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}:${mins.toString().padStart(2, "0")}`;
}

export function formatTimeInChinese(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    const hourWords: Record<number, string> = {
        1: "一", 2: "二", 3: "三", 4: "四", 5: "五",
        6: "六", 7: "七", 8: "八", 9: "九", 10: "十",
        11: "十一", 12: "十二",
    };

    const hourChinese = hourWords[hours] || hours.toString();

    if (mins === 0) return `${hourChinese}点`;
    if (mins === 30) return `${hourChinese}点半`;
    if (mins === 15) return `${hourChinese}点一刻`;
    if (mins === 45) {
        const nextHour = hourWords[hours + 1] || (hours + 1).toString();
        return `差一刻${nextHour}点`;
    }

    const minWords: Record<number, string> = { 5: "五", 10: "十", 20: "二十", 40: "四十", 50: "五十" };
    const minChinese = minWords[mins] || mins.toString();
    return `${hourChinese}点${minChinese}分`;
}

export function getProgressMessage(progress: number): string {
    if (progress < 30) return "刚开始!";
    if (progress < 50) return "部分完成!";
    if (progress < 80) return "大部分完成!";
    return "快到了!";
}

export function calculateSpeedBonus(timeMs: number): number {
    const maxTime = 10000;
    if (timeMs >= maxTime) return 0;
    return Math.round((1 - timeMs / maxTime) * 50);
}

export function calculateStreakBonus(streak: number): number {
    if (streak < 2) return 0;
    return (streak - 1) * 25;
}
