
export interface LotoDraw {
  id: string;
  date: string;
  numbers: number[];
  specialNumber: number;
  day?: string;
}

export interface LotoStats {
  numberFrequency: Record<number, number>;
  specialNumberFrequency: Record<number, number>;
  combinationPairs: Record<string, number>;
  dayFrequency?: Record<string, number>;
}

export interface LotoPrediction {
  numbers: number[];
  specialNumber: number;
  confidence: number;
  method: string;
  status?: "pending" | "verified" | "matched";
}
