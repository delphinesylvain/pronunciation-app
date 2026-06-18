export interface LessonWord {
  id: number;
  word: string;
  ipa: string;
  phonemes?: string[];
}

export function initializeNewLesson(): void {
  sessionStorage.removeItem("dynamic_lesson_words");
}

export function getLessonWords(): LessonWord[] {
  const stored = sessionStorage.getItem("dynamic_lesson_words");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return [];
    }
  }
  return [];
}

export function getWordByIndex(index: number): LessonWord | undefined {
  const words = getLessonWords();
  return words[index - 1];
}

export function clearLessonData(): void {
  for (let i = 1; i <= 5; i++) {
    sessionStorage.removeItem(`analysis_${i}`);
  }
  sessionStorage.removeItem("dynamic_lesson_words");
}