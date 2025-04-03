
import { LotoDraw, LotoPrediction } from "@/types/loto";
import { calculateStats } from "./stats-calculator";

// Prédiction avancée simulant une IA
export const predictAI = (draws: LotoDraw[]): LotoPrediction => {
  // Calcul des stats de base
  const stats = calculateStats(draws);
  
  // Simuler une analyse plus avancée
  // Pour l'exemple, on va juste faire une prédiction qui prend en compte les tendances récentes
  const recentDraws = draws.slice(0, 10);
  const recentStats = calculateStats(recentDraws);
  
  // Combiner les deux analyses
  const combinedFrequency: Record<number, number> = {};
  
  for (let i = 1; i <= 49; i++) {
    // Pondération: 40% stats globales, 60% stats récentes
    combinedFrequency[i] = (stats.numberFrequency[i] * 0.4) + 
                           (recentStats.numberFrequency[i] * 0.6);
  }
  
  // Sélectionner les numéros
  const freqArray = Object.entries(combinedFrequency)
    .map(([num, freq]) => ({ num: parseInt(num), freq }))
    .sort((a, b) => b.freq - a.freq);
  
  // Prendre un mix de numéros à haute fréquence et quelques wild cards
  const selectedNumbers: number[] = [];
  
  // 3 numéros à haute fréquence
  for (let i = 0; i < 3; i++) {
    if (i < freqArray.length) {
      selectedNumbers.push(freqArray[i].num);
    }
  }
  
  // 2 numéros aléatoires parmi les moins fréquents
  while (selectedNumbers.length < 5) {
    const randomNum = Math.floor(Math.random() * 49) + 1;
    if (!selectedNumbers.includes(randomNum)) {
      selectedNumbers.push(randomNum);
    }
  }
  
  // Trier les numéros
  selectedNumbers.sort((a, b) => a - b);
  
  // Choisir un numéro chance basé sur une analyse complexe simulée
  const specialNumberIndex = Math.floor(Math.random() * 10) + 1;
  
  return {
    numbers: selectedNumbers,
    specialNumber: specialNumberIndex,
    confidence: 0.78,
    method: "Intelligence artificielle prédictive"
  };
};

// Prédiction basée sur l'analyse des tendances et cycles
export const predictTrendAnalysis = (draws: LotoDraw[]): LotoPrediction => {
  // Analyser les tendances sur les derniers 20 tirages
  const recentDraws = draws.slice(0, 20);
  
  // Identifier les tendances croissantes/décroissantes dans les numéros
  const numberTrends: Record<number, number> = {};
  
  // Initialiser les tendances
  for (let i = 1; i <= 49; i++) {
    numberTrends[i] = 0;
  }
  
  // Calculer les tendances (croissance ou décroissance de fréquence)
  for (let i = 0; i < 10; i++) {
    // Comparer les 10 tirages les plus récents avec les 10 suivants
    const recentTenDraws = recentDraws.slice(0, 10);
    const olderTenDraws = recentDraws.slice(10, 20);
    
    // Compter les occurrences dans les deux périodes
    const recentFreq: Record<number, number> = {};
    const olderFreq: Record<number, number> = {};
    
    for (let i = 1; i <= 49; i++) {
      recentFreq[i] = 0;
      olderFreq[i] = 0;
    }
    
    recentTenDraws.forEach(draw => {
      draw.numbers.forEach(num => {
        recentFreq[num]++;
      });
    });
    
    olderTenDraws.forEach(draw => {
      draw.numbers.forEach(num => {
        olderFreq[num]++;
      });
    });
    
    // Calculer les tendances
    for (let i = 1; i <= 49; i++) {
      numberTrends[i] += recentFreq[i] - olderFreq[i];
    }
  }
  
  // Sélectionner les numéros avec la plus forte tendance à la hausse
  const trendingNumbers = Object.entries(numberTrends)
    .map(([num, trend]) => ({ num: parseInt(num), trend }))
    .sort((a, b) => b.trend - a.trend)
    .slice(0, 10)
    .map(item => item.num);
  
  // Sélectionner 5 numéros parmi les plus tendance
  const selectedNumbers: number[] = [];
  while (selectedNumbers.length < 5) {
    const randomIndex = Math.floor(Math.random() * trendingNumbers.length);
    const num = trendingNumbers[randomIndex];
    if (!selectedNumbers.includes(num)) {
      selectedNumbers.push(num);
    }
  }
  
  // Trier les numéros
  selectedNumbers.sort((a, b) => a - b);
  
  // Choisir un numéro chance
  const specialNumber = Math.floor(Math.random() * 10) + 1;
  
  return {
    numbers: selectedNumbers,
    specialNumber,
    confidence: 0.72,
    method: "Analyse des tendances et cycles"
  };
};
