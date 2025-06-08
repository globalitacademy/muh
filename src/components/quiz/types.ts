
export interface QuizQuestion {
  id: string | number;
  question: string;
  options: string[];
  correct: number; // Keep as number for internal use
  correct_answer?: string; // Original string answer from database
  explanation?: string;
}

export interface QuizState {
  currentQuestion: number;
  answers: Record<number, string>;
  showResults: boolean;
  score: number;
}
