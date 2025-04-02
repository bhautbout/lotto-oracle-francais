
import { useState } from "react";
import { LotoDraw, LotoStats, LotoPrediction } from "@/types/loto";
import { predictBasedOnStats, predictAI } from "@/lib/loto-utils";
import { Database } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Define types based on Database type
type PredictionsRow = Database['public']['Tables']['predictions']['Row'];

export const usePredictions = (draws: LotoDraw[], stats: LotoStats | null) => {
  const [predictions, setPredictions] = useState<LotoPrediction[]>([]);

  // Fonction pour récupérer les prédictions depuis Supabase
  const fetchPredictions = async () => {
    try {
      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Convertir les données de Supabase au format LotoPrediction
      const formattedPredictions: LotoPrediction[] = data.map((prediction: PredictionsRow) => ({
        numbers: prediction.numbers,
        specialNumber: prediction.special_number,
        confidence: Number(prediction.confidence),
        method: prediction.method,
        status: prediction.status as "pending" | "verified" | "matched" | undefined
      }));

      setPredictions(formattedPredictions);
    } catch (error) {
      console.error("Erreur lors de la récupération des prédictions:", error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les prédictions",
        variant: "destructive",
      });
    }
  };

  // Générer et sauvegarder des prédictions
  const generatePredictions = (count: number = 5) => {
    if (!stats || draws.length < 10) {
      toast({
        title: "Données insuffisantes",
        description: "Il faut au moins 10 tirages pour générer des prédictions.",
        variant: "destructive",
      });
      return;
    }
    
    const newPredictions: LotoPrediction[] = [];
    
    // Générer des prédictions statistiques
    for (let i = 0; i < Math.ceil(count / 2); i++) {
      newPredictions.push(predictBasedOnStats(stats));
    }
    
    // Générer des prédictions IA
    for (let i = 0; i < Math.floor(count / 2); i++) {
      newPredictions.push(predictAI(draws));
    }
    
    // Sauvegarder les prédictions dans Supabase
    Promise.all(
      newPredictions.map(async (prediction) => {
        const { error } = await supabase
          .from('predictions')
          .insert({
            numbers: prediction.numbers,
            special_number: prediction.specialNumber,
            confidence: prediction.confidence,
            method: prediction.method,
            status: 'pending'
          });
        
        if (error) throw error;
      })
    )
    .then(() => {
      toast({
        title: "Prédictions générées",
        description: `${count} combinaisons ont été générées.`,
      });
      fetchPredictions();
    })
    .catch((error) => {
      console.error("Erreur lors de l'enregistrement des prédictions:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer les prédictions",
        variant: "destructive",
      });
    });
  };

  return {
    predictions,
    fetchPredictions,
    generatePredictions
  };
};
