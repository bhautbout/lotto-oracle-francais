
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

// Validation des numéros de loto
export const validateLotoNumbers = (numbers: number[], specialNumber: number): boolean => {
  // Vérifier qu'il y a 5 numéros
  if (numbers.length !== 5) return false;
  
  // Vérifier que les numéros sont entre 1 et 49
  if (!numbers.every(num => num >= 1 && num <= 49)) return false;
  
  // Vérifier qu'il n'y a pas de doublons
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

