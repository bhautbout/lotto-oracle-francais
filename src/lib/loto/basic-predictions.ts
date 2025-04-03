
import { LotoDraw, LotoPrediction, LotoStats } from "@/types/loto";
import { calculateStats } from "./stats-calculator";

// Fonction pour prédire des numéros basée sur les statistiques
export const predictBasedOnStats = (stats: LotoStats): LotoPrediction => {
  // Tableau de fréquence pour les numéros normaux
  const freqArray = Object.entries(stats.numberFrequency)
    .map(([num, freq]) => ({ num: parseInt(num), freq }))
    .sort((a, b) => b.freq - a.freq);
  
  // Tableau de fréquence pour les numéros chance
  const specialFreqArray = Object.entries(stats.specialNumberFrequency)
    .map(([num, freq]) => ({ num: parseInt(num), freq }))
    .sort((a, b) => b.freq - a.freq);
  
  // Sélectionner un mélange de numéros fréquents et moins fréquents
  const topNumbers = freqArray.slice(0, 20).map(item => item.num);
  const selectedNumbers: number[] = [];
  
  // Sélectionner 5 numéros uniques
  while (selectedNumbers.length < 5) {
    const randomIndex = Math.floor(Math.random() * topNumbers.length);
    const num = topNumbers[randomIndex];
    if (!selectedNumbers.includes(num)) {
      selectedNumbers.push(num);
    }
  }
  
  // Trier les numéros
  selectedNumbers.sort((a, b) => a - b);
  
  // Choisir un numéro chance parmi les plus fréquents
  const topSpecialNumbers = specialFreqArray.slice(0, 3).map(item => item.num);
  const specialNumber = topSpecialNumbers[Math.floor(Math.random() * topSpecialNumbers.length)];
  
  return {
    numbers: selectedNumbers,
    specialNumber,
    confidence: 0.65,
    method: "Analyse statistique de fréquence"
  };
};

// Nouvelle fonction: Prédiction basée sur l'analyse de numéros chauds et froids
export const predictHotColdAnalysis = (draws: LotoDraw[]): LotoPrediction => {
  const stats = calculateStats(draws);
  
  // Identifier les numéros "chauds" (tirés fréquemment récemment)
  const recentDraws = draws.slice(0, 15);
  const recentStats = calculateStats(recentDraws);
  
  // Classifier les numéros comme chauds, tièdes ou froids
  const hotNumbers: number[] = [];
  const warmNumbers: number[] = [];
  const coldNumbers: number[] = [];
  
  for (let i = 1; i <= 49; i++) {
    const overallFreq = stats.numberFrequency[i] || 0;
    const recentFreq = recentStats.numberFrequency[i] || 0;
    
    // Si le numéro est plus fréquent récemment, il est "chaud"
    if (recentFreq > overallFreq * 1.5) {
      hotNumbers.push(i);
    } 
    // Si le numéro a une fréquence moyenne, il est "tiède"
    else if (recentFreq >= overallFreq * 0.8) {
      warmNumbers.push(i);
    } 
    // Sinon il est "froid"
    else {
      coldNumbers.push(i);
    }
  }
  
  // Sélectionner un mix de numéros chauds et froids (stratégie équilibrée)
  // 3 numéros chauds, 1 tiède, 1 froid
  const selectedNumbers: number[] = [];
  
  // Ajouter 3 numéros chauds
  for (let i = 0; i < 3; i++) {
    if (hotNumbers.length > 0) {
      const randomIndex = Math.floor(Math.random() * hotNumbers.length);
      const num = hotNumbers[randomIndex];
      hotNumbers.splice(randomIndex, 1); // Retirer le numéro choisi
      selectedNumbers.push(num);
    } else if (warmNumbers.length > 0) {
      // Fallback si pas assez de numéros chauds
      const randomIndex = Math.floor(Math.random() * warmNumbers.length);
      const num = warmNumbers[randomIndex];
      warmNumbers.splice(randomIndex, 1);
      selectedNumbers.push(num);
    }
  }
  
  // Ajouter 1 numéro tiède
  if (warmNumbers.length > 0) {
    const randomIndex = Math.floor(Math.random() * warmNumbers.length);
    const num = warmNumbers[randomIndex];
    warmNumbers.splice(randomIndex, 1);
    selectedNumbers.push(num);
  } else if (coldNumbers.length > 0) {
    // Fallback
    const randomIndex = Math.floor(Math.random() * coldNumbers.length);
    const num = coldNumbers[randomIndex];
    coldNumbers.splice(randomIndex, 1);
    selectedNumbers.push(num);
  }
  
  // Ajouter 1 numéro froid (pour équilibrer)
  if (coldNumbers.length > 0) {
    const randomIndex = Math.floor(Math.random() * coldNumbers.length);
    const num = coldNumbers[randomIndex];
    coldNumbers.splice(randomIndex, 1);
    selectedNumbers.push(num);
  } else if (warmNumbers.length > 0) {
    // Fallback
    const randomIndex = Math.floor(Math.random() * warmNumbers.length);
    const num = warmNumbers[randomIndex];
    selectedNumbers.push(num);
  }
  
  // S'assurer qu'on a 5 numéros uniques
  while (selectedNumbers.length < 5) {
    const randomNum = Math.floor(Math.random() * 49) + 1;
    if (!selectedNumbers.includes(randomNum)) {
      selectedNumbers.push(randomNum);
    }
  }
  
  // Trier les numéros
  selectedNumbers.sort((a, b) => a - b);
  
  // Choisir un numéro chance parmi les plus fréquents récemment
  const topSpecialNumbers = Object.entries(recentStats.specialNumberFrequency)
    .map(([num, freq]) => ({ num: parseInt(num), freq }))
    .sort((a, b) => b.freq - a.freq)
    .slice(0, 5)
    .map(item => item.num);
  
  const specialNumber = topSpecialNumbers[Math.floor(Math.random() * topSpecialNumbers.length)] || 
                       (Math.floor(Math.random() * 10) + 1);
  
  return {
    numbers: selectedNumbers,
    specialNumber,
    confidence: 0.68,
    method: "Analyse numéros chauds/froids"
  };
};
