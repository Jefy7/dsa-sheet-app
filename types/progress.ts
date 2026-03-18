export interface ProgressItem {
  problemId: string;
  completed: boolean;
}

export interface ProgressUpdatePayload {
  problemId: string;
  completed: boolean;
}
