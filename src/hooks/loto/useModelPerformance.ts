
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

  useEffect(() => {
    if (!draws.length || !predictions.length) return;

    console.log(`Analyse de performance avec ${predictions.length} prédictions`);
    
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
        // Nous limitons l'index au nombre de tirages disponibles
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
      
      if (analyzedPredictions > 0) {
        performanceData.push({
          method,
          totalPredictions: methodPredictions.length,
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
    setPerformance(performanceData);
  }, [draws, predictions]);

  return {
    performance,
    selectedMethod,
    setSelectedMethod
  };
};
