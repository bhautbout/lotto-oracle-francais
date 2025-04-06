
import { useState, useCallback } from "react";
import { LotoDraw } from "@/types/loto";
import { toast } from "@/hooks/use-toast";
import { 
  fetchDrawsFromDb, 
  addDrawToDb, 
  updateDrawInDb, 
  deleteDrawFromDb 
} from "./useDrawsDb";
import { validateDraw } from "./useDrawsValidation";

export const useDraws = () => {
  const [draws, setDraws] = useState<LotoDraw[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fonction pour récupérer les tirages depuis Supabase
  const fetchDraws = useCallback(async () => {
    try {
      setIsLoading(true);
      const fetchedDraws = await fetchDrawsFromDb();
      setDraws(fetchedDraws);
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
  }, []);

  // Ajouter un tirage
  const addDraw = useCallback(async (draw: Omit<LotoDraw, "id">) => {
    try {
      console.log("Ajout d'un tirage:", draw);
      
      // Validation des données
      const validation = validateDraw(draw);
      if (!validation.valid) {
        toast({
          title: "Validation échouée",
          description: validation.error,
          variant: "destructive",
        });
        return;
      }

      await addDrawToDb(draw);
      
      toast({
        title: "Tirage ajouté",
        description: `Tirage du ${draw.date} ajouté avec succès.`,
      });
      
      // La récupération automatique se fera via le channel
      fetchDraws();
    } catch (error: any) {
      console.error("Erreur lors de l'ajout du tirage:", error);
      toast({
        title: "Erreur",
        description: error?.message || "Impossible d'ajouter le tirage",
        variant: "destructive",
      });
    }
  }, [fetchDraws]);

  // Modifier un tirage
  const updateDraw = useCallback(async (id: string, updatedDraw: Omit<LotoDraw, "id">) => {
    try {
      console.log("Mise à jour du tirage:", id, updatedDraw);
      
      // Validation des données
      const validation = validateDraw(updatedDraw);
      if (!validation.valid) {
        toast({
          title: "Validation échouée",
          description: validation.error,
          variant: "destructive",
        });
        return;
      }
      
      await updateDrawInDb(id, updatedDraw);
      
      toast({
        title: "Tirage mis à jour",
        description: `Tirage du ${updatedDraw.date} mis à jour.`,
      });
      
      // La récupération automatique se fera via le channel
      fetchDraws();
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour du tirage:", error);
      toast({
        title: "Erreur",
        description: error?.message || "Impossible de mettre à jour le tirage",
        variant: "destructive",
      });
    }
  }, [fetchDraws]);

  // Supprimer un tirage
  const deleteDraw = useCallback(async (id: string) => {
    try {
      console.log("Suppression du tirage:", id);
      await deleteDrawFromDb(id);
      
      toast({
        title: "Tirage supprimé",
        description: "Le tirage a été supprimé avec succès.",
      });
      
      // La récupération automatique se fera via le channel
      fetchDraws();
    } catch (error: any) {
      console.error("Erreur lors de la suppression du tirage:", error);
      toast({
        title: "Erreur",
        description: error?.message || "Impossible de supprimer le tirage",
        variant: "destructive",
      });
    }
  }, [fetchDraws]);

  return {
    draws,
    fetchDraws,
    isLoading,
    addDraw,
    updateDraw,
    deleteDraw
  };
};
