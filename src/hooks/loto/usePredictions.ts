
import { useState, useCallback } from "react";
import { LotoDraw, LotoPrediction, LotoStats } from "@/types/loto";
import { toast } from "@/hooks/use-toast";
import { fetchPredictionsFromDb, savePredictionsToDb } from "./usePredictionsDb";
import { generatePredictionData } from "./usePredictionGenerator";

export const usePredictions = (draws: LotoDraw[], stats: LotoStats | null) => {
  const [predictions, setPredictions] = useState<LotoPrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch predictions from Supabase
  const fetchPredictions = useCallback(async () => {
    try {
      setIsLoading(true);
      const fetchedPredictions = await fetchPredictionsFromDb();
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

  // Generate predictions based on stats
  const generatePredictions = useCallback(async (count = 4) => {
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
      
      // Generate predictions using the training data
      const predictions = await generatePredictionData(draws, stats, count);
      
      // Save predictions to Supabase
      await savePredictionsToDb(predictions);
      
      // Show success message
      const trainingSize = draws.length > 1000 ? 1000 : draws.length;
      toast({
        title: "Prédictions générées",
        description: `${predictions.length} nouvelles prédictions ont été générées en utilisant ${trainingSize} tirages d'entraînement.`,
      });

      // Refresh predictions
      fetchPredictions();
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
