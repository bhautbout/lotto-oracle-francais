
import { LotoDraw, LotoStats } from "@/types/loto";
import { generateOptimalNumbers } from "@/lib/loto";

/**
 * Prepares training data and generates predictions
 */
export const generatePredictionData = async (
  draws: LotoDraw[],
  stats: LotoStats | null,
  count = 4
): Promise<Array<{
  numbers: number[],
  special_number: number,
  confidence: number,
  method: string,
  status: string
}>> => {
  // Ensure we have stats available
  if (!stats || draws.length < 10) {
    throw new Error("Au moins 10 tirages sont nécessaires pour générer des prédictions");
  }

  // Prepare training data (up to the last 1000 draws)
  const trainingData = draws.length > 1000 
    ? draws.slice(0, 1000) 
    : draws;
  
  console.log(`Entraînement sur ${trainingData.length} tirages`);
  
  // Recalculate stats on the training data
  const { calculateStats } = await import("@/lib/loto");
  const trainingStats = calculateStats(trainingData);

  // Use different prediction methods
  const methods = ["frequency", "patterns", "machine-learning", "advanced"];
  const predictions: Array<{
    numbers: number[],
    special_number: number,
    confidence: number,
    method: string,
    status: string
  }> = [];

  // Generate only the requested number of predictions
  const methodsToUse = count <= methods.length 
    ? methods.slice(0, count) 
    : [...Array(count)].map((_, i) => methods[i % methods.length]);

  for (const method of methodsToUse) {
    const { numbers, specialNumber, confidence } = generateOptimalNumbers(trainingData, trainingStats, method);
    
    predictions.push({
      numbers,
      special_number: specialNumber,
      confidence,
      method,
      status: "pending"
    });
  }

  return predictions;
};
