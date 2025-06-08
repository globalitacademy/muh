
export interface QuizQuestion {
  id: string | number;
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
}

export interface QuizState {
  currentQuestion: number;
  answers: Record<number, string>;
  showResults: boolean;
  score: number;
}
