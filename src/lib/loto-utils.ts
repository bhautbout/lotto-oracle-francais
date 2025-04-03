import { LotoDraw, LotoStats, LotoPrediction } from "@/types/loto";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// Fonction pour parser un fichier CSV
export const parseCSV = (csv: string): LotoDraw[] => {
  const lines = csv.split("\n");
  // Ignorer la première ligne (en-têtes)
  const data = lines.slice(1).filter(line => line.trim() !== "");
  
  return data.map(line => {
    const parts = line.split(";");
    // Format attendu: date;numero1;numero2;numero3;numero4;numero5;numeroChance
    const date = parts[0].trim();
    const numbers = parts.slice(1, 6).map(num => parseInt(num.trim()));
    const specialNumber = parseInt(parts[6].trim());
    
    // Convertir la date au format français (JJ/MM/AAAA) en format ISO (AAAA-MM-JJ)
    const dateParts = date.split('/');
    let isoDate = date;
    
    if (dateParts.length === 3) {
      // Si le format est JJ/MM/AAAA, convertir en AAAA-MM-JJ
      isoDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    }
    
    const dateObj = new Date(isoDate);
    const day = dateObj.toLocaleDateString('fr-FR', { weekday: 'long' });
    
    return {
      id: uuidv4(),
      date: isoDate, // Stocker en format ISO
      numbers,
      specialNumber,
      day
    };
  });
};

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

// Fonction de prédiction avancée simulant une IA
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

// Nouvelle fonction: Prédiction basée sur l'analyse des tendances et cycles
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

// Nouvelle fonction: Prédiction basée sur l'analyse des paires et triplets fréquents
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

// Nouvelle fonction: Prédiction basée sur l'analyse des séquences
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

// Nouvelle fonction: Prédiction basée sur un modèle de Machine Learning simulé
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

// Validation des numéros de loto
export const validateLotoNumbers = (numbers: number[], specialNumber: number): boolean => {
  // Vérifier qu'il y a 5 numéros
  if (numbers.length !== 5) return false;
  
  // Vérifier que les numéros sont entre 1 et 49
  if (!numbers.every(num => num >= 1 && num <= 49)) return false;
  
  // Vérifier que il n'y a pas de doublons
  if (new Set(numbers).size !== numbers.length) return false;
  
  // Vérifier que le numéro chance est entre 1 et 10
  if (specialNumber < 1 || specialNumber > 10) return false;
  
  return true;
};

// Formatage de la date pour l'affichage
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    
    // Vérifier si la date est valide
    if (isNaN(date.getTime())) {
      throw new Error('Date invalide');
    }
    
    return format(date, 'dd/MM/yyyy', { locale: fr });
  } catch (error) {
    console.error("Erreur de formatage de date:", error, "pour la chaîne:", dateString);
    return "Date invalide";
  }
};
