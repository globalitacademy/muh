
export interface QuizQuestion {
  id: string | number;
  question: string;
  options: string[];
  correct: number;
  correct_answer?: number; // Alternative field name that might be used
  explanation?: string;
}

export interface QuizState {
  currentQuestion: number;
  answers: Record<number, string>;
  showResults: boolean;
  score: number;
}
