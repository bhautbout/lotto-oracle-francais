
import { useState, useCallback, useEffect } from "react";
import { useDraws } from "./loto/useDraws";
import { usePredictions } from "./loto/usePredictions";
import { useCSVImport } from "./loto/useCSVImport";
import { useStats } from "./loto/useStats";
import { useRealtimeUpdates } from "./loto/useRealtimeUpdates";
import { LotoDraw } from "@/types/loto";

export const useLotoData = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Hooks extraits pour la gestion des données
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
  
  // Wrapper for generating predictions that accepts a count
  const generatePredictions = useCallback((count = 4) => {
    return generatePredictionsBase(count);
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
    generatePredictions
  };
};
