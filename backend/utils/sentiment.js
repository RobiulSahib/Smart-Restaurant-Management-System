/**
 * AI-Lite Sentiment Analysis Utility
 * Classifies text into Happy, Neutral, or Angry based on keywords.
 */

const MOODS = {
    ANGRY: { label: 'Angry', score: 3, color: 'Red' },
    NEUTRAL: { label: 'Neutral', score: 2, color: 'Yellow' },
    HAPPY: { label: 'Happy', score: 1, color: 'Green' }
};

const KEYWORDS = {
    ANGRY: [
        'late', 'bad', 'angry', 'cold', 'slow', 'complain', 'worst',
        'horrible', 'terrible', 'wait', 'wrong', 'disappointed', 'missing',
        'উচিত না', 'খুব খারাপ', 'দেরি', 'অসন্তোষ'
    ],
    HAPPY: [
        'good', 'thanks', 'great', 'awesome', 'excellent', 'love', 'best',
        'delicious', 'amazing', 'happy', 'perfect', 'nice',
        'ভালো', 'ধন্যবাদ', 'সেরা', 'অসাধারণ', 'চমৎকার'
    ]
};

export const detectMood = (text) => {
    if (!text) return MOODS.NEUTRAL;

    const lowerText = text.toLowerCase();

    // Check for Angry keywords
    const angryMatch = KEYWORDS.ANGRY.some(word => lowerText.includes(word));
    if (angryMatch) return MOODS.ANGRY;

    // Check for Happy keywords
    const happyMatch = KEYWORDS.HAPPY.some(word => lowerText.includes(word));
    if (happyMatch) return MOODS.HAPPY;

    return MOODS.NEUTRAL;
};
