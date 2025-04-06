
import { LotoDraw, LotoStats } from "@/types/loto";
import { predictBasedOnStats, predictHotColdAnalysis } from "./basic-predictions";
import { predictAI, predictTrendAnalysis } from "./advanced-predictions";
import { predictPairsAnalysis, predictSequenceAnalysis } from "./pattern-predictions";
import { predictMachineLearning } from "./ml-predictions";

// Generate optimal numbers based on different prediction methods
export const generateOptimalNumbers = (
  draws: LotoDraw[], 
  stats: LotoStats, 
  method: string
) => {
  // Use different prediction methods based on the specified method
  switch (method.toLowerCase()) {
    case "frequency":
      return predictBasedOnStats(stats);
    case "hot-cold":
    case "hotcold":
      return predictHotColdAnalysis(draws);
    case "patterns":
      return Math.random() > 0.5 ? predictPairsAnalysis(draws) : predictSequenceAnalysis(draws);
    case "machine-learning":
    case "ml":
      return predictMachineLearning(draws);
    case "advanced":
      return Math.random() > 0.5 ? predictAI(draws) : predictTrendAnalysis(draws);
    default:
      // Fallback to basic stats-based prediction
      return predictBasedOnStats(stats);
  }
};
