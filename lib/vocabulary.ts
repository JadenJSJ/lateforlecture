// Vocabulary data for Chapter 6 - Time expressions and university life
export interface VocabularyItem {
    id: number;
    chinese: string;
    pinyin: string;
    english: string;
}

export const vocabulary: VocabularyItem[] = [
    { id: 1, chinese: "大学", pinyin: "dàxué", english: "university" },
    { id: 2, chinese: "早上", pinyin: "zǎoshang", english: "morning" },
    { id: 3, chinese: "几", pinyin: "jǐ", english: "what/how many" },
    { id: 4, chinese: "点", pinyin: "diǎn", english: "o'clock" },
    { id: 5, chinese: "上课", pinyin: "shàngkè", english: "to start class" },
    { id: 6, chinese: "大部分", pinyin: "dàbùfèn", english: "most/majority" },
    { id: 7, chinese: "部分", pinyin: "bùfèn", english: "part" },
    { id: 8, chinese: "九", pinyin: "jiǔ", english: "nine" },
    { id: 9, chinese: "我们", pinyin: "wǒmen", english: "we/us" },
    { id: 10, chinese: "八", pinyin: "bā", english: "eight" },
    { id: 11, chinese: "五十", pinyin: "wǔshí", english: "fifty" },
    { id: 12, chinese: "分", pinyin: "fēn", english: "minute" },
    { id: 13, chinese: "下课", pinyin: "xiàkè", english: "to end class" },
    { id: 14, chinese: "十", pinyin: "shí", english: "ten" },
    { id: 15, chinese: "半", pinyin: "bàn", english: "half" },
    { id: 16, chinese: "太……了", pinyin: "tài...le", english: "too..." },
    { id: 17, chinese: "早", pinyin: "zǎo", english: "early" },
    { id: 18, chinese: "讲座", pinyin: "jiǎngzuò", english: "lecture" },
    { id: 19, chinese: "开始", pinyin: "kāishǐ", english: "to begin" },
    { id: 20, chinese: "七", pinyin: "qī", english: "seven" },
    { id: 21, chinese: "现在", pinyin: "xiànzài", english: "now" },
    { id: 22, chinese: "差", pinyin: "chà", english: "lacking/to" },
    { id: 23, chinese: "一", pinyin: "yī", english: "one" },
    { id: 24, chinese: "刻", pinyin: "kè", english: "quarter (15 min)" },
    { id: 25, chinese: "六", pinyin: "liù", english: "six" },
    { id: 26, chinese: "一会儿", pinyin: "yīhuìr", english: "a moment" },
    { id: 27, chinese: "见", pinyin: "jiàn", english: "to see/meet" },
];

// Helper function to get vocabulary by ID
export function getVocabularyById(id: number): VocabularyItem | undefined {
    return vocabulary.find((v) => v.id === id);
}

// Get random vocabulary items excluding specific IDs
export function getRandomVocabulary(
    count: number,
    excludeIds: number[] = []
): VocabularyItem[] {
    const available = vocabulary.filter((v) => !excludeIds.includes(v.id));
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

// Feedback messages used throughout the game
export const feedbackMessages = {
    correct: ["太好了!", "太快了!", "我们继续!", "太厉害了!"],
    wrong: ["太慢了!", "再试一会儿!", "差一点!"],
    progress: {
        start: "刚开始!",
        partial: "部分完成!",
        mostly: "大部分完成!",
        almost: "快到了!",
    },
};

// Obstacle animations for wrong answers
export const obstacles = [
    { emoji: "☕", message: "太烫了!", english: "Too hot!" },
    { emoji: "👋", message: "等一会儿!", english: "Wait a moment!" },
    { emoji: "🚲", message: "小心!", english: "Watch out!" },
    { emoji: "📚", message: "我的书!", english: "My books!" },
    { emoji: "🏢", message: "这不是我们的大学!", english: "This isn't our university!" },
];
