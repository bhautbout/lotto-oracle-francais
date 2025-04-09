
import { LotoDraw, LotoStats } from "@/types/loto";
import { generateOptimalNumbers, predictionMethods } from "@/lib/loto";

/**
 * Prepares training data and generates predictions
 */
export const generatePredictionData = async (
  draws: LotoDraw[],
  stats: LotoStats | null,
  count = 4,
  specificMethods: string[] = []
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

  // Determine which methods to use
  let methodsToUse: string[];
  
  if (specificMethods && specificMethods.length > 0) {
    // Use user-specified methods
    methodsToUse = specificMethods;
  } else {
    // Use all available methods or limit to count
    const availableMethods = predictionMethods.map(m => m.id);
    methodsToUse = count <= availableMethods.length 
      ? availableMethods.slice(0, count) 
      : [...Array(count)].map((_, i) => availableMethods[i % availableMethods.length]);
  }

  console.log(`Génération de prédictions avec ${methodsToUse.length} méthodes: ${methodsToUse.join(', ')}`);
  
  const predictions: Array<{
    numbers: number[],
    special_number: number,
    confidence: number,
    method: string,
    status: string
  }> = [];

  for (const method of methodsToUse) {
    const { numbers, specialNumber, confidence, method: methodName } = generateOptimalNumbers(trainingData, trainingStats, method);
    
    predictions.push({
      numbers,
      special_number: specialNumber,
      confidence,
      method: methodName,
      status: "pending"
    });
  }

  return predictions;
};

export const getAvailableMethods = () => {
  return predictionMethods;
};
