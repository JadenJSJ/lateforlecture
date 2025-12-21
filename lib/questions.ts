// Question generator for all 6 question types
import { vocabulary, getRandomVocabulary, VocabularyItem } from "./vocabulary";
import { Question, QuestionType, formatTimeInChinese } from "./gameState";

const timeValues = [
    { minutes: 480, display: "8:00" },
    { minutes: 495, display: "8:15" },
    { minutes: 510, display: "8:30" },
    { minutes: 525, display: "8:45" },
    { minutes: 540, display: "9:00" },
    { minutes: 555, display: "9:15" },
    { minutes: 420, display: "7:00" },
    { minutes: 450, display: "7:30" },
    { minutes: 360, display: "6:00" },
    { minutes: 600, display: "10:00" },
];

const fillBlankTemplates = [
    { template: "___上好!", answer: "早", prompt: "Good morning!" },
    { template: "___点了?", answer: "几", prompt: "What time is it?" },
    { template: "讲座___点开始", answer: "几", prompt: "What time does the lecture start?" },
];

const sentenceTemplates = [
    { sentence: "我们的讲座九点___", answer: "开始", options: ["开始", "下课", "见", "早"] },
    { sentence: "现在八点半,___上好!", answer: "早", options: ["早", "晚", "下", "上"] },
    { sentence: "课___了,我们走吧", answer: "下", options: ["下", "上", "开始", "半"], vocabId: 13 },
];

function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function getWrongAnswers(correct: string, pool: string[], count: number): string[] {
    const filtered = pool.filter((item) => item !== correct);
    return shuffleArray(filtered).slice(0, count);
}

function generateTimeReadingQuestion(id: number): Question {
    const time = timeValues[Math.floor(Math.random() * timeValues.length)];
    const correctAnswer = formatTimeInChinese(time.minutes);
    const wrongTimes = timeValues
        .filter((t) => t.minutes !== time.minutes)
        .slice(0, 3)
        .map((t) => formatTimeInChinese(t.minutes));

    return {
        id,
        type: "timeReading",
        prompt: "现在几点?",
        displayElement: time.display,
        answers: shuffleArray([correctAnswer, ...wrongTimes]),
        correctAnswers: [correctAnswer],
        vocabularyIds: [21, 3, 4],
        pinyin: "xiànzài jǐ diǎn?",
    };
}

function generateChineseToEnglishQuestion(id: number, vocab: VocabularyItem): Question {
    const wrongAnswers = getWrongAnswers(vocab.english, vocabulary.map((v) => v.english), 3);
    return {
        id,
        type: "chineseToEnglish",
        prompt: `"${vocab.chinese}" means...`,
        answers: shuffleArray([vocab.english, ...wrongAnswers]),
        correctAnswers: [vocab.english],
        vocabularyIds: [vocab.id],
        pinyin: vocab.pinyin,
    };
}

function generateEnglishToChineseQuestion(id: number, vocab: VocabularyItem): Question {
    const wrongAnswers = getWrongAnswers(vocab.chinese, vocabulary.map((v) => v.chinese), 3);
    return {
        id,
        type: "englishToChinese",
        prompt: `How do you say "${vocab.english}"?`,
        answers: shuffleArray([vocab.chinese, ...wrongAnswers]),
        correctAnswers: [vocab.chinese],
        vocabularyIds: [vocab.id],
    };
}

function generateFillBlankQuestion(id: number): Question {
    const template = fillBlankTemplates[Math.floor(Math.random() * fillBlankTemplates.length)];
    const vocab = vocabulary.find((v) => v.chinese === template.answer);
    const wrongAnswers = getWrongAnswers(
        template.answer,
        vocabulary.map((v) => v.chinese).filter((c) => c.length === 1),
        3
    );

    return {
        id,
        type: "fillBlank",
        prompt: template.prompt,
        displayElement: template.template,
        answers: shuffleArray([template.answer, ...wrongAnswers]),
        correctAnswers: [template.answer],
        vocabularyIds: vocab ? [vocab.id] : [],
        pinyin: vocab?.pinyin,
    };
}

function generateTimeConstructionQuestion(id: number): Question {
    const times = [
        { display: "8:30", answer: "半", alternatives: ["三十分"] },
        { display: "8:45", answer: "四十五分", alternatives: ["三刻"] },
        { display: "8:15", answer: "一刻", alternatives: ["十五分"] },
    ];

    const time = times[Math.floor(Math.random() * times.length)];
    const hour = parseInt(time.display.split(":")[0]);
    const hourWord: Record<number, string> = { 7: "七", 8: "八", 9: "九" };
    const wrongAnswers = ["半", "一刻", "整", "四十五分"].filter(
        (a) => a !== time.answer && !time.alternatives.includes(a)
    ).slice(0, 3);

    return {
        id,
        type: "timeConstruction",
        prompt: `"${time.display}" = ${hourWord[hour] || hour}点___`,
        answers: shuffleArray([time.answer, ...wrongAnswers]),
        correctAnswers: [time.answer, ...time.alternatives],
        vocabularyIds: [15, 24, 11, 12],
    };
}

function generateSentenceCompleteQuestion(id: number): Question {
    const template = sentenceTemplates[Math.floor(Math.random() * sentenceTemplates.length)];
    return {
        id,
        type: "sentenceComplete",
        prompt: template.sentence,
        answers: shuffleArray([...template.options]),
        correctAnswers: [template.answer],
        vocabularyIds: template.vocabId ? [template.vocabId] : [19],
    };
}

export function generateQuestions(count: number = 10): Question[] {
    const questions: Question[] = [];
    const usedVocabIds = new Set<number>();
    let questionId = 1;

    // Add 2 time reading questions
    for (let i = 0; i < 2; i++) {
        questions.push(generateTimeReadingQuestion(questionId++));
        [21, 3, 4].forEach((id) => usedVocabIds.add(id));
    }

    // Add Chinese to English questions
    const priorityVocab = vocabulary.filter((v) => [1, 2, 5, 13, 17, 18, 19, 21, 26, 27].includes(v.id));
    const chineseToEnglishVocab = shuffleArray(priorityVocab).slice(0, 3);
    for (const vocab of chineseToEnglishVocab) {
        questions.push(generateChineseToEnglishQuestion(questionId++, vocab));
        usedVocabIds.add(vocab.id);
    }

    // Add English to Chinese questions
    const englishToChineseVocab = shuffleArray(vocabulary.filter((v) => !usedVocabIds.has(v.id))).slice(0, 2);
    for (const vocab of englishToChineseVocab) {
        questions.push(generateEnglishToChineseQuestion(questionId++, vocab));
        usedVocabIds.add(vocab.id);
    }

    questions.push(generateFillBlankQuestion(questionId++));
    questions.push(generateTimeConstructionQuestion(questionId++));
    questions.push(generateSentenceCompleteQuestion(questionId++));

    // Fill remaining slots
    const types: QuestionType[] = ["chineseToEnglish", "englishToChinese", "timeReading"];
    while (questions.length < count) {
        const type = types[Math.floor(Math.random() * types.length)];
        const unusedVocab = vocabulary.filter((v) => !usedVocabIds.has(v.id));
        const vocabToUse = unusedVocab.length > 0
            ? unusedVocab[Math.floor(Math.random() * unusedVocab.length)]
            : getRandomVocabulary(1)[0];

        if (type === "chineseToEnglish") {
            questions.push(generateChineseToEnglishQuestion(questionId++, vocabToUse));
        } else if (type === "englishToChinese") {
            questions.push(generateEnglishToChineseQuestion(questionId++, vocabToUse));
        } else {
            questions.push(generateTimeReadingQuestion(questionId++));
        }
        usedVocabIds.add(vocabToUse.id);
    }

    return shuffleArray(questions).slice(0, count);
}

export function getMissedVocabulary(
    answeredQuestions: { vocabularyIds: number[]; isCorrect: boolean }[]
): VocabularyItem[] {
    const missedIds = new Set<number>();
    answeredQuestions
        .filter((q) => !q.isCorrect)
        .forEach((q) => q.vocabularyIds.forEach((id) => missedIds.add(id)));
    return vocabulary.filter((v) => missedIds.has(v.id));
}
