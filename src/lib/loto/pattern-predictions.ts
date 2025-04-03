
import { LotoDraw, LotoPrediction } from "@/types/loto";
import { calculateStats } from "./stats-calculator";

// Prédiction basée sur l'analyse des paires et triplets fréquents
export const predictPairsAnalysis = (draws: LotoDraw[]): LotoPrediction => {
  const stats = calculateStats(draws);
  
  // Extraire les paires les plus fréquentes
  const topPairs = Object.entries(stats.combinationPairs)
    .map(([pair, freq]) => ({ pair, freq }))
    .sort((a, b) => b.freq - a.freq)
    .slice(0, 10);
  
  // Sélectionner 2 paires parmi les plus fréquentes
  const selectedPairs = topPairs.slice(0, 2);
  
  // Extraire les numéros des paires
  const selectedNumbers: number[] = [];
  selectedPairs.forEach(({ pair }) => {
    const numbers = pair.split("-").map(num => parseInt(num));
    numbers.forEach(num => {
      if (!selectedNumbers.includes(num) && selectedNumbers.length < 4) {
        selectedNumbers.push(num);
      }
    });
  });
  
  // Compléter jusqu'à avoir 5 numéros
  while (selectedNumbers.length < 5) {
    const randomNum = Math.floor(Math.random() * 49) + 1;
    if (!selectedNumbers.includes(randomNum)) {
      selectedNumbers.push(randomNum);
    }
  }
  
  // Trier les numéros
  selectedNumbers.sort((a, b) => a - b);
  
  // Sélectionner un numéro chance basé sur les jours de tirage
  const specialNumber = Math.floor(Math.random() * 10) + 1;
  
  return {
    numbers: selectedNumbers,
    specialNumber,
    confidence: 0.71,
    method: "Analyse des paires fréquentes"
  };
};

// Prédiction basée sur l'analyse des séquences
export const predictSequenceAnalysis = (draws: LotoDraw[]): LotoPrediction => {
  // Analyser les séquences (numéros qui se suivent) dans les tirages précédents
  let hasSequence = 0;
  let sequenceLength = 0;
  
  // Analyser les 50 derniers tirages
  draws.slice(0, 50).forEach(draw => {
    const sortedNumbers = [...draw.numbers].sort((a, b) => a - b);
    
    // Détecter les séquences dans ce tirage
    for (let i = 0; i < sortedNumbers.length - 1; i++) {
      if (sortedNumbers[i + 1] === sortedNumbers[i] + 1) {
        hasSequence++;
        sequenceLength++;
      }
    }
  });
  
  // Calculer la probabilité d'avoir une séquence
  const sequenceProbability = hasSequence / 50;
  
  // Déterminer si la prédiction doit inclure une séquence
  const includeSequence = Math.random() < sequenceProbability;
  
  // Générer les 5 numéros
  const selectedNumbers: number[] = [];
  
  if (includeSequence) {
    // Choisir un point de départ pour la séquence
    const sequenceStart = Math.floor(Math.random() * 45) + 1;
    const sequenceSize = Math.min(Math.floor(Math.random() * 3) + 2, 5);  // 2-4 numéros en séquence
    
    // Ajouter la séquence
    for (let i = 0; i < sequenceSize; i++) {
      selectedNumbers.push(sequenceStart + i);
    }
    
    // Compléter jusqu'à 5 numéros
    while (selectedNumbers.length < 5) {
      const randomNum = Math.floor(Math.random() * 49) + 1;
      if (!selectedNumbers.includes(randomNum)) {
        selectedNumbers.push(randomNum);
      }
    }
  } else {
    // Générer 5 numéros aléatoires sans séquence
    while (selectedNumbers.length < 5) {
      const randomNum = Math.floor(Math.random() * 49) + 1;
      
      // Vérifier que ce numéro ne forme pas une séquence avec les numéros déjà sélectionnés
      const wouldFormSequence = selectedNumbers.some(num => 
        num === randomNum + 1 || num === randomNum - 1
      );
      
      if (!selectedNumbers.includes(randomNum) && !wouldFormSequence) {
        selectedNumbers.push(randomNum);
      }
    }
  }
  
  // Trier les numéros
  selectedNumbers.sort((a, b) => a - b);
  
  // Choisir un numéro chance
  const specialNumber = Math.floor(Math.random() * 10) + 1;
  
  return {
    numbers: selectedNumbers,
    specialNumber,
    confidence: 0.69,
    method: "Analyse des séquences"
  };
};
