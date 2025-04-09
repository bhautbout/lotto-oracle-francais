
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
  }>({ drawsCount: 0, predictionsCount: 0 });

  useEffect(() => {
    if (!draws.length || !predictions.length) return;

    // Vérifier si nous avons de nouvelles prédictions ou nouveaux tirages
    const hasNewData = predictions.length !== previousData.predictionsCount || 
                        draws.length !== previousData.drawsCount;
                        
    if (!hasNewData && performance.length > 0) {
      // Si les données n'ont pas changé et nous avons déjà des performances calculées, ne pas recalculer
      return;
    }
    
    console.log(`Analyse de performance avec ${predictions.length} prédictions`);
    setPreviousData({ drawsCount: draws.length, predictionsCount: predictions.length });
    
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
      
      methodPredictions.forEach((prediction, index) => {
        // Utiliser un index fixe basé sur l'index de la prédiction pour avoir des résultats cohérents
        // mais s'assurer que l'index ne dépasse pas la longueur du tableau des tirages
        if (sortedDraws.length > 0) {
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
        }
      });
      
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
    
    // Sauvegarde des anciens totaux
    const previousTotals = new Map<string, { numbersFound: number, specialNumbersFound: number }>();
    performance.forEach(p => {
      previousTotals.set(p.method, { 
        numbersFound: p.numbersFound, 
        specialNumbersFound: p.specialNumbersFound 
      });
    });
    
    // Si nous avions des méthodes sélectionnées, conserver la sélection
    if (selectedMethod && !performanceData.find(p => p.method === selectedMethod)) {
      setSelectedMethod(null);
    }
    
    setPerformance(performanceData);
  }, [draws, predictions, previousData.drawsCount, previousData.predictionsCount, performance.length, selectedMethod]);

  return {
    performance,
    selectedMethod,
    setSelectedMethod
  };
};
