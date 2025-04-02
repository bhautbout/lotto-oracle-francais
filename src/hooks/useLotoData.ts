
import { useState, useEffect } from "react";
import { LotoDraw, LotoStats, LotoPrediction } from "@/types/loto";
import { calculateStats, predictBasedOnStats, predictAI, parseCSV } from "@/lib/loto-utils";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useLotoData = () => {
  const [draws, setDraws] = useState<LotoDraw[]>([]);
  const [stats, setStats] = useState<LotoStats | null>(null);
  const [predictions, setPredictions] = useState<LotoPrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch data from Supabase on component mount
  useEffect(() => {
    fetchDraws();
    fetchPredictions();
  }, []);

  // Subscribe to real-time updates
  useEffect(() => {
    const drawsChannel = supabase
      .channel('draws-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'draws' 
        }, 
        () => {
          fetchDraws();
        }
      )
      .subscribe();

    const predictionsChannel = supabase
      .channel('predictions-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'predictions' 
        }, 
        () => {
          fetchPredictions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(drawsChannel);
      supabase.removeChannel(predictionsChannel);
    };
  }, []);

  // Mettre à jour les statistiques quand les tirages changent
  useEffect(() => {
    if (draws.length > 0) {
      const newStats = calculateStats(draws);
      setStats(newStats);
    } else {
      setStats(null);
    }
  }, [draws]);

  // Fonction pour récupérer les tirages depuis Supabase
  const fetchDraws = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('draws')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      // Convertir les données de Supabase au format LotoDraw
      const formattedDraws: LotoDraw[] = data.map(draw => ({
        id: draw.id,
        date: draw.date,
        day: draw.day || undefined,
        numbers: draw.numbers,
        specialNumber: draw.special_number
      }));

      setDraws(formattedDraws);
    } catch (error) {
      console.error("Erreur lors de la récupération des tirages:", error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les tirages",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour récupérer les prédictions depuis Supabase
  const fetchPredictions = async () => {
    try {
      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Convertir les données de Supabase au format LotoPrediction
      const formattedPredictions: LotoPrediction[] = data.map(prediction => ({
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

  // Importer des données CSV
  const importCSV = (csv: string) => {
    try {
      setIsLoading(true);
      const parsedDraws = parseCSV(csv);
      
      if (parsedDraws.length === 0) {
        throw new Error("Aucune donnée n'a pu être importée");
      }
      
      // Insérer les tirages dans Supabase
      Promise.all(
        parsedDraws.map(async (draw) => {
          const { error } = await supabase
            .from('draws')
            .insert({
              date: draw.date,
              day: draw.day,
              numbers: draw.numbers,
              special_number: draw.specialNumber
            });
          
          if (error) throw error;
        })
      )
      .then(() => {
        toast({
          title: "Importation réussie",
          description: `${parsedDraws.length} tirages ont été importés.`,
        });
        fetchDraws();
      })
      .catch((error) => {
        console.error("Erreur lors de l'insertion des tirages:", error);
        toast({
          title: "Erreur d'importation",
          description: "Une erreur est survenue lors de l'enregistrement des tirages",
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
    } catch (error) {
      console.error("Erreur d'importation:", error);
      toast({
        title: "Erreur d'importation",
        description: error instanceof Error ? error.message : "Format de fichier invalide",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // Ajouter un tirage
  const addDraw = async (draw: Omit<LotoDraw, "id">) => {
    try {
      const { data, error } = await supabase
        .from('draws')
        .insert({
          date: draw.date,
          day: draw.day,
          numbers: draw.numbers,
          special_number: draw.specialNumber
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Tirage ajouté",
        description: `Tirage du ${draw.date} ajouté avec succès.`,
      });
      
      // Mettre à jour le state localement (la récupération automatique se fera via le channel)
      fetchDraws();
    } catch (error) {
      console.error("Erreur lors de l'ajout du tirage:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le tirage",
        variant: "destructive",
      });
    }
  };

  // Modifier un tirage
  const updateDraw = async (id: string, updatedDraw: Omit<LotoDraw, "id">) => {
    try {
      const { error } = await supabase
        .from('draws')
        .update({
          date: updatedDraw.date,
          day: updatedDraw.day,
          numbers: updatedDraw.numbers,
          special_number: updatedDraw.specialNumber
        })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Tirage mis à jour",
        description: `Tirage du ${updatedDraw.date} mis à jour.`,
      });
      
      // Mettre à jour le state localement (la récupération automatique se fera via le channel)
      fetchDraws();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du tirage:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le tirage",
        variant: "destructive",
      });
    }
  };

  // Supprimer un tirage
  const deleteDraw = async (id: string) => {
    try {
      const { error } = await supabase
        .from('draws')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Tirage supprimé",
        description: "Le tirage a été supprimé avec succès.",
      });
      
      // Mettre à jour le state localement (la récupération automatique se fera via le channel)
      fetchDraws();
    } catch (error) {
      console.error("Erreur lors de la suppression du tirage:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le tirage",
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
