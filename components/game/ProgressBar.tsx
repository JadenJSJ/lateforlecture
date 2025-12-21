"use client";

import { Progress } from "@/components/ui/progress";
import { getProgressMessage } from "@/lib/gameState";

interface ProgressBarProps {
    progress: number;
    questionNumber: number;
    totalQuestions: number;
}

export function ProgressBar({ progress, questionNumber, totalQuestions }: ProgressBarProps) {
    const progressMessage = getProgressMessage(progress);

    return (
        <div className="w-full p-3 md:p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs md:text-sm font-medium text-slate-600">Question {questionNumber}/{totalQuestions}</span>
                <span className="text-sm md:text-lg font-bold text-emerald-600">{progressMessage}</span>
            </div>

            <div className="relative">
                <div className="absolute inset-0 bg-slate-200 rounded-full overflow-hidden">
                    <div className="absolute inset-0 flex items-center px-2">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="flex-1 h-1 mx-1 bg-slate-300 rounded" style={{ opacity: i * 10 < progress ? 0.3 : 0.6 }} />
                        ))}
                    </div>
                </div>
                <Progress value={progress} className="h-6 md:h-8 bg-transparent" />
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4"><span className="text-xl md:text-2xl">🏠</span></div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4"><span className="text-xl md:text-2xl">🏛️</span></div>
                <div className="absolute top-1/2 -translate-y-1/2 transition-all duration-500 ease-out" style={{ left: `calc(${Math.min(progress, 95)}% - 12px)` }}>
                    <span className="text-xl md:text-2xl animate-bounce">🏃</span>
                </div>
            </div>

            <div className="flex justify-between mt-2 text-xs text-slate-500">
                <span>宿舍 (Dorm)</span>
                <span>讲座 (Lecture)</span>
            </div>
        </div>
    );
}
