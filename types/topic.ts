export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface ProblemLinks {
  youtube?: string;
  leetcode?: string;
  codeforces?: string;
  article?: string;
}

export interface Problem {
  id: string;
  title: string;
  difficulty: Difficulty;
  links?: ProblemLinks;
}

export interface Topic {
  id: string;
  title: string;
  problems: Problem[];
}
