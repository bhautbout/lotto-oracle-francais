
import { useState } from "react";
import { LotoDraw, LotoStats, LotoPrediction } from "@/types/loto";
import { 
  predictBasedOnStats, 
  predictAI, 
  predictTrendAnalysis,
  predictHotColdAnalysis,
  predictPairsAnalysis,
  predictSequenceAnalysis,
  predictMachineLearning
} from "@/lib/loto-utils";
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
    
    // Distribution des méthodes de prédiction
    const methodsDistribution = [
      { method: "statsBasedPrediction", weight: 2 },
      { method: "aiBasedPrediction", weight: 2 },
      { method: "trendAnalysis", weight: 1 },
      { method: "hotColdAnalysis", weight: 1 },
      { method: "pairsAnalysis", weight: 1 },
      { method: "sequenceAnalysis", weight: 1 },
      { method: "machineLearning", weight: 2 }
    ];
    
    // Calculer le poids total
    const totalWeight = methodsDistribution.reduce((sum, method) => sum + method.weight, 0);
    
    // Générer les prédictions en fonction de la distribution
    for (let i = 0; i < count; i++) {
      // Choisir une méthode en fonction de son poids
      let randomValue = Math.random() * totalWeight;
      let selectedMethod = "";
      
      for (const method of methodsDistribution) {
        randomValue -= method.weight;
        if (randomValue <= 0) {
          selectedMethod = method.method;
          break;
        }
      }
      
      // Générer la prédiction avec la méthode sélectionnée
      let prediction: LotoPrediction;
      
      switch (selectedMethod) {
        case "statsBasedPrediction":
          prediction = predictBasedOnStats(stats);
          break;
        case "aiBasedPrediction":
          prediction = predictAI(draws);
          break;
        case "trendAnalysis":
          prediction = predictTrendAnalysis(draws);
          break;
        case "hotColdAnalysis":
          prediction = predictHotColdAnalysis(draws);
          break;
        case "pairsAnalysis":
          prediction = predictPairsAnalysis(draws);
          break;
        case "sequenceAnalysis":
          prediction = predictSequenceAnalysis(draws);
          break;
        case "machineLearning":
          prediction = predictMachineLearning(draws);
          break;
        default:
          // Fallback sur la méthode statistique
          prediction = predictBasedOnStats(stats);
      }
      
      newPredictions.push(prediction);
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
        description: `${count} combinaisons ont été générées avec diverses méthodes d'IA.`,
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
