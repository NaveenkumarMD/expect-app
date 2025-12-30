interface Expectation {
  id: number | null;
  title: string;
  options: string;
  created_at: number;
  expected_at: number;
  isDisappointed?: boolean;
  result?: string;
  resultPercentage?: number;
  archived?: boolean;
}

interface Note {
  id: number | null;
  category: string;
  notes: string;
  isDone?: boolean;
  createdAt?: number;
  updatedAt?: number;
}

export { Expectation, Note };
