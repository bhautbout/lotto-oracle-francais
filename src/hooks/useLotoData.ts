import { useState, useCallback, useEffect } from "react";
import { useDraws } from "./loto/useDraws";
import { usePredictions } from "./loto/usePredictions";
import { useCSVImport } from "./loto/useCSVImport";
import { useStats } from "./loto/useStats";
import { useRealtimeUpdates } from "./loto/useRealtimeUpdates";
import { LotoDraw } from "@/types/loto";

// Define a type for the generatePredictions options
type GeneratePredictionsOptions = {
  count?: number;
  specificMethods?: string[];
};

export const useLotoData = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const { 
    draws, 
    fetchDraws, 
    addDraw, 
    updateDraw, 
    deleteDraw,
    isLoading: isDrawsLoading
  } = useDraws();
  
  const { stats } = useStats(draws);
  
  const { 
    predictions, 
    fetchPredictions, 
    generatePredictions: generatePredictionsBase
  } = usePredictions(draws, stats);
  
  // Update the wrapper for generating predictions to accept an options object
  const generatePredictions = useCallback((options?: GeneratePredictionsOptions) => {
    const count = options?.count || 4;
    const specificMethods = options?.specificMethods || [];
    return generatePredictionsBase(count, specificMethods);
  }, [generatePredictionsBase]);
  
  // Callbacks pour les mises à jour en temps réel
  const handleDrawsUpdate = useCallback(() => {
    console.log("Mise à jour des tirages reçue");
    fetchDraws();
  }, [fetchDraws]);
  
  const handlePredictionsUpdate = useCallback(() => {
    console.log("Mise à jour des prédictions reçue");
    fetchPredictions();
  }, [fetchPredictions]);
  
  // Configurer les abonnements en temps réel
  useRealtimeUpdates(handleDrawsUpdate, handlePredictionsUpdate);
  
  // Charger les données initiales
  useEffect(() => {
    fetchDraws();
    fetchPredictions();
  }, [fetchDraws, fetchPredictions]);
  
  // Extraction du hook useCSVImport hors du callback
  const { importCSV: doImport } = useCSVImport(() => {
    setIsLoading(false);
    fetchDraws();
  });
  
  // Wrapper pour l'importation CSV avec gestion du chargement
  const importCSV = useCallback((csv: string) => {
    setIsLoading(true);
    doImport(csv);
  }, [doImport]);
  
  return {
    draws,
    stats,
    predictions,
    isLoading: isLoading || isDrawsLoading,
    importCSV,
    addDraw,
    updateDraw,
    deleteDraw,
    generatePredictions,
    fetchPredictions
  };
};
