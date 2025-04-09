
import { useState, useCallback } from "react";
import { LotoDraw, LotoPrediction, LotoStats } from "@/types/loto";
import { toast } from "@/hooks/use-toast";
import { fetchPredictionsFromDb, savePredictionsToDb } from "./usePredictionsDb";
import { generatePredictionData } from "./usePredictionGenerator";

export const usePredictions = (draws: LotoDraw[], stats: LotoStats | null) => {
  const [predictions, setPredictions] = useState<LotoPrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPredictions = useCallback(async (limit = 5000) => {
    try {
      setIsLoading(true);
      const fetchedPredictions = await fetchPredictionsFromDb(limit);
      setPredictions(fetchedPredictions);
    } catch (error) {
      console.error("Erreur lors de la récupération des prédictions:", error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les prédictions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generatePredictions = useCallback(async (count = 4, specificMethods: string[] = []) => {
    try {
      if (!stats || draws.length < 10) {
        toast({
          title: "Données insuffisantes",
          description: "Au moins 10 tirages sont nécessaires pour générer des prédictions",
          variant: "destructive",
        });
        return;
      }

      setIsLoading(true);
      
      const predictions = await generatePredictionData(draws, stats, count, specificMethods);
      
      await savePredictionsToDb(predictions);
      
      const trainingSize = draws.length > 1000 ? 1000 : draws.length;
      toast({
        title: "Prédictions générées",
        description: `${predictions.length} nouvelles prédictions ont été générées en utilisant ${trainingSize} tirages d'entraînement.`,
      });

      fetchPredictions(5000); // Augmentation du nombre de prédictions récupérées par défaut
    } catch (error) {
      console.error("Erreur lors de la génération des prédictions:", error);
      toast({
        title: "Erreur",
        description: "Impossible de générer des prédictions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [draws, stats, fetchPredictions]);

  return {
    predictions,
    fetchPredictions,
    generatePredictions,
    isLoading
  };
};
