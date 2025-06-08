
export interface Exercise {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  hint?: string;
  expectedAnswer?: string;
  question?: string;
  type?: string;
  options?: string[];
  answer?: string;
  correct_answer?: string; // For consistency with quiz format
}
