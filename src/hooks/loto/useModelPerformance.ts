
import { useState, useEffect } from "react";
import { LotoDraw, LotoPrediction } from "@/types/loto";

type MethodPerformance = {
  method: string;
  totalPredictions: number;
  numbersFound: number;
  specialNumbersFound: number;
  averageNumbers: number;
  averageSpecialNumbers: number;
  predictions: Array<{
    prediction: LotoPrediction;
    matchingDraw: LotoDraw;
    matchedNumbers: number[];
    matchedSpecialNumber: boolean;
  }>;
};

export const useModelPerformance = (draws: LotoDraw[], predictions: LotoPrediction[]) => {
  const [performance, setPerformance] = useState<MethodPerformance[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [previousData, setPreviousData] = useState<{
    drawsCount: number;
    predictionsCount: number;
    predictionsHash: string;
  }>({ drawsCount: 0, predictionsCount: 0, predictionsHash: '' });

  useEffect(() => {
    if (!draws.length || !predictions.length) return;

    // Créer un hash des IDs de prédictions pour détecter les changements de contenu
    const predictionsHash = predictions
      .map(p => p.id)
      .sort()
      .join('|');
    
    // Vérifier si nous avons de nouvelles prédictions ou nouveaux tirages
    const hasNewData = predictions.length !== previousData.predictionsCount || 
                       draws.length !== previousData.drawsCount ||
                       predictionsHash !== previousData.predictionsHash;
                        
    if (!hasNewData && performance.length > 0) {
      // Si les données n'ont pas changé et nous avons déjà des performances calculées, ne pas recalculer
      console.log("Aucune nouvelle donnée détectée, conservation de l'analyse de performance existante");
      return;
    }
    
    console.log(`Analyse de performance avec ${predictions.length} prédictions et ${draws.length} tirages`);
    console.log(`Nombre précédent de prédictions: ${previousData.predictionsCount}`);
    
    // Mise à jour des données précédentes
    setPreviousData({ 
      drawsCount: draws.length, 
      predictionsCount: predictions.length,
      predictionsHash: predictionsHash
    });
    
    const sortedDraws = [...draws].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // Regrouper les prédictions par méthode
    const methodGroups: Record<string, LotoPrediction[]> = {};
    predictions.forEach(prediction => {
      if (!methodGroups[prediction.method]) {
        methodGroups[prediction.method] = [];
      }
      methodGroups[prediction.method].push(prediction);
    });

    // Analyser les performances pour chaque méthode
    const performanceData: MethodPerformance[] = [];
    
    Object.entries(methodGroups).forEach(([method, methodPredictions]) => {
      let numbersFound = 0;
      let specialNumbersFound = 0;
      const detailedPredictions: MethodPerformance["predictions"] = [];
      
      // Analyser toutes les prédictions
      let analyzedPredictions = 0;
      
      // S'assurer que nous avons des tirages avant de continuer
      if (sortedDraws.length > 0) {
        methodPredictions.forEach((prediction, index) => {
          // Utiliser un index fixe basé sur l'index de la prédiction pour avoir des résultats cohérents
          const drawIndex = index % sortedDraws.length;
          const matchingDraw = sortedDraws[drawIndex];
          
          if (matchingDraw) {
            // Compter les numéros trouvés
            const matchedNumbers = prediction.numbers.filter(num => 
              matchingDraw.numbers.includes(num)
            );
            
            const matchedSpecialNumber = prediction.specialNumber === matchingDraw.specialNumber;
            
            numbersFound += matchedNumbers.length;
            specialNumbersFound += matchedSpecialNumber ? 1 : 0;
            analyzedPredictions++;
            
            detailedPredictions.push({
              prediction,
              matchingDraw,
              matchedNumbers,
              matchedSpecialNumber
            });
          }
        });
      }
      
      if (analyzedPredictions > 0) {
        performanceData.push({
          method,
          totalPredictions: methodPredictions.length, // Nombre total de prédictions pour cette méthode
          numbersFound,
          specialNumbersFound,
          averageNumbers: numbersFound / analyzedPredictions,
          averageSpecialNumbers: specialNumbersFound / analyzedPredictions,
          predictions: detailedPredictions
        });
      }
    });
    
    // Trier par performance (nombre moyen de numéros trouvés)
    performanceData.sort((a, b) => (b.averageNumbers + b.averageSpecialNumbers) - (a.averageNumbers + a.averageSpecialNumbers));
    
    console.log(`Performance data generated for ${performanceData.length} methods`);
    console.log(`Nombre total de prédictions analysées: ${performanceData.reduce((acc, method) => acc + method.predictions.length, 0)}`);
    
    // Vérifier si la méthode sélectionnée existe toujours
    if (selectedMethod && !performanceData.find(p => p.method === selectedMethod)) {
      setSelectedMethod(null);
    }
    
    setPerformance(performanceData);
  }, [draws, predictions, performance.length, selectedMethod]);

  return {
    performance,
    selectedMethod,
    setSelectedMethod
  };
};
