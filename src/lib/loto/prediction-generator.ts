
import { LotoDraw, LotoStats } from "@/types/loto";
import { predictBasedOnStats, predictHotColdAnalysis } from "./basic-predictions";
import { predictAI, predictTrendAnalysis } from "./advanced-predictions";
import { predictPairsAnalysis, predictSequenceAnalysis } from "./pattern-predictions";
import { predictMachineLearning } from "./ml-predictions";

// Liste complète des méthodes de prédiction disponibles
export const predictionMethods = [
  { id: "frequency", name: "Analyse statistique de fréquence" },
  { id: "hot-cold", name: "Analyse numéros chauds/froids" },
  { id: "patterns", name: "Analyse des paires fréquentes" },
  { id: "sequence", name: "Analyse des séquences" },
  { id: "machine-learning", name: "Machine Learning Prédictif" }, 
  { id: "ai", name: "Intelligence artificielle prédictive" },
  { id: "trend", name: "Analyse des tendances et cycles" }
];

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
      return predictPairsAnalysis(draws);
    case "sequence":
      return predictSequenceAnalysis(draws);
    case "machine-learning":
    case "ml":
      return predictMachineLearning(draws);
    case "ai":
      return predictAI(draws);
    case "trend":
      return predictTrendAnalysis(draws);
    default:
      // Fallback to basic stats-based prediction
      return predictBasedOnStats(stats);
  }
};

