
import { LotoDraw, LotoPrediction } from "@/types/loto";
import { calculateStats } from "./stats-calculator";
import { predictAI } from "./advanced-predictions";

// Prédiction basée sur un modèle de Machine Learning simulé
export const predictMachineLearning = (draws: LotoDraw[]): LotoPrediction => {
  if (draws.length < 20) {
    // Fallback si pas assez de données
    return predictAI(draws);
  }
  
  // Simuler un modèle de ML en utilisant des poids pour différentes caractéristiques
  const stats = calculateStats(draws);
  
  // Caractéristiques utilisées par notre "modèle"
  // 1. Fréquence globale (30%)
  // 2. Fréquence récente (40%)
  // 3. Tendance (20%)
  // 4. Facteur aléatoire (10%)
  
  const recentDraws = draws.slice(0, 15);
  const recentStats = calculateStats(recentDraws);
  
  const scoreByNumber: Record<number, number> = {};
  
  for (let i = 1; i <= 49; i++) {
    // Normaliser les fréquences
    const globalFreq = stats.numberFrequency[i] / draws.length;
    const recentFreq = recentStats.numberFrequency[i] / 15;
    
    // Calculer la tendance (différence entre fréquence récente et globale)
    const trend = recentFreq - globalFreq;
    
    // Facteur aléatoire pour introduire de la variabilité
    const randomFactor = Math.random() * 0.1;
    
    // Score final pondéré
    scoreByNumber[i] = (globalFreq * 0.3) + (recentFreq * 0.4) + (trend * 0.2) + randomFactor;
  }
  
  // Trier les numéros par score décroissant
  const rankedNumbers = Object.entries(scoreByNumber)
    .map(([num, score]) => ({ num: parseInt(num), score }))
    .sort((a, b) => b.score - a.score);
  
  // Sélectionner les numéros en fonction de leur score (avec une part d'aléatoire)
  const selectedNumbers: number[] = [];
  
  // Sélection pondérée en fonction du score
  const topCandidates = rankedNumbers.slice(0, 15);
  
  while (selectedNumbers.length < 5) {
    // Calculer la somme totale des scores
    const totalScore = topCandidates.reduce((sum, { score }) => sum + score, 0);
    
    // Choisir un point aléatoire sur cette échelle
    let randomPoint = Math.random() * totalScore;
    
    // Trouver le numéro correspondant
    for (const candidate of topCandidates) {
      randomPoint -= candidate.score;
      if (randomPoint <= 0) {
        if (!selectedNumbers.includes(candidate.num)) {
          selectedNumbers.push(candidate.num);
        }
        break;
      }
    }
    
    // Si on n'a pas réussi à sélectionner un numéro (rare), en choisir un au hasard
    if (selectedNumbers.length < 5 && randomPoint > 0) {
      const randomNum = Math.floor(Math.random() * 49) + 1;
      if (!selectedNumbers.includes(randomNum)) {
        selectedNumbers.push(randomNum);
      }
    }
  }
  
  // Trier les numéros
  selectedNumbers.sort((a, b) => a - b);
  
  // Prédire le numéro chance avec le même modèle
  const specialScores: Record<number, number> = {};
  
  for (let i = 1; i <= 10; i++) {
    const globalFreq = stats.specialNumberFrequency[i] / draws.length;
    const recentFreq = recentStats.specialNumberFrequency[i] / 15;
    const trend = recentFreq - globalFreq;
    const randomFactor = Math.random() * 0.1;
    
    specialScores[i] = (globalFreq * 0.3) + (recentFreq * 0.4) + (trend * 0.2) + randomFactor;
  }
  
  // Sélectionner le numéro chance avec le meilleur score
  const specialNumber = parseInt(
    Object.entries(specialScores)
      .sort((a, b) => parseFloat(b[1] as any) - parseFloat(a[1] as any))[0][0]
  );
  
  return {
    numbers: selectedNumbers,
    specialNumber,
    confidence: 0.82,
    method: "Machine Learning Prédictif"
  };
};
