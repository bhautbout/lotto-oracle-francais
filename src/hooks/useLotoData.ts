
import { useState, useEffect } from "react";
import { LotoDraw, LotoStats, LotoPrediction } from "@/types/loto";
import { calculateStats, predictBasedOnStats, predictAI, parseCSV } from "@/lib/loto-utils";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/hooks/use-toast";

export const useLotoData = () => {
  const [draws, setDraws] = useState<LotoDraw[]>([]);
  const [stats, setStats] = useState<LotoStats | null>(null);
  const [predictions, setPredictions] = useState<LotoPrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Charger les données depuis le localStorage
  useEffect(() => {
    const savedDraws = localStorage.getItem("lotoDraws");
    if (savedDraws) {
      try {
        const parsedDraws = JSON.parse(savedDraws);
        setDraws(parsedDraws);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données sauvegardées",
          variant: "destructive",
        });
      }
    }
  }, []);

  // Mettre à jour les statistiques quand les tirages changent
  useEffect(() => {
    if (draws.length > 0) {
      const newStats = calculateStats(draws);
      setStats(newStats);
      // Sauvegarder dans le localStorage
      localStorage.setItem("lotoDraws", JSON.stringify(draws));
    } else {
      setStats(null);
    }
  }, [draws]);

  // Importer des données CSV
  const importCSV = (csv: string) => {
    try {
      setIsLoading(true);
      const parsedDraws = parseCSV(csv);
      
      if (parsedDraws.length === 0) {
        throw new Error("Aucune donnée n'a pu être importée");
      }
      
      setDraws(parsedDraws);
      toast({
        title: "Importation réussie",
        description: `${parsedDraws.length} tirages ont été importés.`,
      });
    } catch (error) {
      console.error("Erreur d'importation:", error);
      toast({
        title: "Erreur d'importation",
        description: error instanceof Error ? error.message : "Format de fichier invalide",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Ajouter un tirage
  const addDraw = (draw: Omit<LotoDraw, "id">) => {
    const newDraw = {
      ...draw,
      id: uuidv4(),
    };
    
    setDraws(prevDraws => [newDraw, ...prevDraws]);
    toast({
      title: "Tirage ajouté",
      description: `Tirage du ${draw.date} ajouté avec succès.`,
    });
  };

  // Modifier un tirage
  const updateDraw = (id: string, updatedDraw: Omit<LotoDraw, "id">) => {
    setDraws(prevDraws =>
      prevDraws.map(draw =>
        draw.id === id ? { ...updatedDraw, id } : draw
      )
    );
    toast({
      title: "Tirage mis à jour",
      description: `Tirage du ${updatedDraw.date} mis à jour.`,
    });
  };

  // Supprimer un tirage
  const deleteDraw = (id: string) => {
    setDraws(prevDraws => prevDraws.filter(draw => draw.id !== id));
    toast({
      title: "Tirage supprimé",
      description: "Le tirage a été supprimé avec succès.",
    });
  };

  // Générer des prédictions
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
    
    setPredictions(newPredictions);
    toast({
      title: "Prédictions générées",
      description: `${count} combinaisons ont été générées.`,
    });
  };

  return {
    draws,
    stats,
    predictions,
    isLoading,
    importCSV,
    addDraw,
    updateDraw,
    deleteDraw,
    generatePredictions
  };
};
