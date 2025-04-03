
import { LotoDraw, LotoStats } from "@/types/loto";

// Fonction pour calculer les statistiques
export const calculateStats = (draws: LotoDraw[]): LotoStats => {
  const numberFrequency: Record<number, number> = {};
  const specialNumberFrequency: Record<number, number> = {};
  const combinationPairs: Record<string, number> = {};
  const dayFrequency: Record<string, number> = {};
  
  // Initialiser les fréquences
  for (let i = 1; i <= 49; i++) {
    numberFrequency[i] = 0;
  }
  
  for (let i = 1; i <= 10; i++) {
    specialNumberFrequency[i] = 0;
  }
  
  draws.forEach(draw => {
    // Fréquence des numéros
    draw.numbers.forEach(num => {
      numberFrequency[num]++;
    });
    
    // Fréquence du numéro chance
    specialNumberFrequency[draw.specialNumber]++;
    
    // Fréquence des paires de numéros
    for (let i = 0; i < draw.numbers.length; i++) {
      for (let j = i + 1; j < draw.numbers.length; j++) {
        const pair = [draw.numbers[i], draw.numbers[j]].sort((a, b) => a - b).join("-");
        combinationPairs[pair] = (combinationPairs[pair] || 0) + 1;
      }
    }
    
    // Fréquence des jours de tirage
    if (draw.day) {
      dayFrequency[draw.day] = (dayFrequency[draw.day] || 0) + 1;
    }
  });
  
  return { numberFrequency, specialNumberFrequency, combinationPairs, dayFrequency };
};
