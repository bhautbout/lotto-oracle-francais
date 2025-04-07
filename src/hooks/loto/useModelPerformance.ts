
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
    ).slice(-500); // Limiter aux 500 derniers tirages
    
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
      
      methodPredictions.forEach(prediction => {
        // Chercher le tirage correspondant (par simplicité, on prend le premier tirage suivant)
        const matchingDrawIndex = sortedDraws.findIndex(draw => 
          new Date(draw.date).getTime() > new Date().getTime()
        );
        
        if (matchingDrawIndex !== -1) {
          const matchingDraw = sortedDraws[matchingDrawIndex];
          
          // Compter les numéros trouvés
          const matchedNumbers = prediction.numbers.filter(num => 
            matchingDraw.numbers.includes(num)
          );
          
          const matchedSpecialNumber = prediction.specialNumber === matchingDraw.specialNumber;
          
          numbersFound += matchedNumbers.length;
          specialNumbersFound += matchedSpecialNumber ? 1 : 0;
          
          detailedPredictions.push({
            prediction,
            matchingDraw,
            matchedNumbers,
            matchedSpecialNumber
          });
        }
      });
      
      performanceData.push({
        method,
        totalPredictions: methodPredictions.length,
        numbersFound,
        specialNumbersFound,
        averageNumbers: methodPredictions.length ? numbersFound / methodPredictions.length : 0,
        averageSpecialNumbers: methodPredictions.length ? specialNumbersFound / methodPredictions.length : 0,
        predictions: detailedPredictions
      });
    });
    
    // Trier par performance (nombre moyen de numéros trouvés)
    performanceData.sort((a, b) => (b.averageNumbers + b.averageSpecialNumbers) - (a.averageNumbers + a.averageSpecialNumbers));
    
    setPerformance(performanceData);
  }, [draws, predictions]);

  return {
    performance,
    selectedMethod,
    setSelectedMethod
  };
};
