
import { useState, useCallback } from "react";
import { LotoDraw } from "@/types/loto";
import { Database } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Define types based on Database type
type DrawsRow = Database['public']['Tables']['draws']['Row'];

export const useDraws = () => {
  const [draws, setDraws] = useState<LotoDraw[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fonction pour récupérer les tirages depuis Supabase
  const fetchDraws = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Récupérer le nombre total de tirages
      let { count } = await supabase
        .from('draws')
        .select('*', { count: 'exact' });
        
      console.log(`Nombre total de tirages: ${count}`);
      
      // Utiliser la pagination pour récupérer tous les tirages
      let allDraws: DrawsRow[] = [];
      const pageSize = 1000; // Taille maximale recommandée par requête
      let page = 0;
      let hasMore = true;
      
      while (hasMore) {
        const { data, error } = await supabase
          .from('draws')
          .select('*')
          .range(page * pageSize, (page + 1) * pageSize - 1)
          .order('date', { ascending: false });
        
        if (error) {
          console.error("Erreur lors de la récupération des tirages:", error);
          throw error;
        }
        
        if (data.length === 0) {
          hasMore = false;
        } else {
          allDraws = [...allDraws, ...data as DrawsRow[]];
          page++;
        }
      }
      
      console.log(`Tirages récupérés: ${allDraws.length}`);

      // Convertir les données de Supabase au format LotoDraw
      const formattedDraws: LotoDraw[] = allDraws.map((draw: DrawsRow) => ({
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
  }, []);

  // Ajouter un tirage
  const addDraw = useCallback(async (draw: Omit<LotoDraw, "id">) => {
    try {
      console.log("Ajout d'un tirage:", draw);
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
      
      if (error) {
        console.error("Erreur Supabase:", error);
        throw error;
      }
      
      console.log("Tirage ajouté avec succès:", data);
      
      toast({
        title: "Tirage ajouté",
        description: `Tirage du ${draw.date} ajouté avec succès.`,
      });
      
      // La récupération automatique se fera via le channel
      fetchDraws();
    } catch (error) {
      console.error("Erreur lors de l'ajout du tirage:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le tirage",
        variant: "destructive",
      });
    }
  }, [fetchDraws]);

  // Modifier un tirage
  const updateDraw = useCallback(async (id: string, updatedDraw: Omit<LotoDraw, "id">) => {
    try {
      console.log("Mise à jour du tirage:", id, updatedDraw);
      const { error } = await supabase
        .from('draws')
        .update({
          date: updatedDraw.date,
          day: updatedDraw.day,
          numbers: updatedDraw.numbers,
          special_number: updatedDraw.specialNumber
        })
        .eq('id', id);
      
      if (error) {
        console.error("Erreur Supabase:", error);
        throw error;
      }
      
      console.log("Tirage mis à jour avec succès");
      
      toast({
        title: "Tirage mis à jour",
        description: `Tirage du ${updatedDraw.date} mis à jour.`,
      });
      
      // La récupération automatique se fera via le channel
      fetchDraws();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du tirage:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le tirage",
        variant: "destructive",
      });
    }
  }, [fetchDraws]);

  // Supprimer un tirage
  const deleteDraw = useCallback(async (id: string) => {
    try {
      console.log("Suppression du tirage:", id);
      const { error } = await supabase
        .from('draws')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error("Erreur Supabase:", error);
        throw error;
      }
      
      console.log("Tirage supprimé avec succès");
      
      toast({
        title: "Tirage supprimé",
        description: "Le tirage a été supprimé avec succès.",
      });
      
      // La récupération automatique se fera via le channel
      fetchDraws();
    } catch (error) {
      console.error("Erreur lors de la suppression du tirage:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le tirage",
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
