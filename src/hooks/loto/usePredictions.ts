
import { useState, useEffect, useCallback } from "react";
import { LotoDraw, LotoPrediction, LotoStats } from "@/types/loto";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { generateOptimalNumbers } from "@/lib/loto";

export const usePredictions = (draws: LotoDraw[], stats: LotoStats | null) => {
  const [predictions, setPredictions] = useState<LotoPrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Récupérer les prédictions depuis Supabase
  const fetchPredictions = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Erreur lors de la récupération des prédictions:", error);
        throw error;
      }

      // Convertir les données de Supabase au format LotoPrediction
      const formattedPredictions: LotoPrediction[] = data.map(p => ({
        id: p.id,
        numbers: p.numbers,
        specialNumber: p.special_number,
        confidence: Number(p.confidence),
        method: p.method,
        status: p.status as "pending" | "verified" | "matched" | undefined
      }));

      setPredictions(formattedPredictions);
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

  // Générer des prédictions basées sur les statistiques
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

      // Utiliser différentes méthodes de prédiction
      const methods = ["frequency", "patterns", "machine-learning", "advanced"];
      const predictions = [];

      // Generate only the number of predictions requested
      const methodsToUse = count <= methods.length 
        ? methods.slice(0, count) 
        : [...Array(count)].map((_, i) => methods[i % methods.length]);

      for (const method of methodsToUse) {
        const { numbers, specialNumber, confidence } = generateOptimalNumbers(draws, stats, method);
        
        predictions.push({
          numbers,
          special_number: specialNumber,
          confidence,
          method,
          status: "pending"
        });
      }

      // Enregistrer les prédictions dans Supabase
      const { error } = await supabase
        .from('predictions')
        .insert(predictions);

      if (error) {
        console.error("Erreur lors de l'enregistrement des prédictions:", error);
        throw error;
      }

      toast({
        title: "Prédictions générées",
        description: `${predictions.length} nouvelles prédictions ont été générées.`,
      });

      // Rafraîchir les prédictions
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
