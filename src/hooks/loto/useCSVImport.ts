
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { parseCSV } from "@/lib/loto";

export const useCSVImport = (onSuccess: () => void) => {
  const importCSV = useCallback(async (csv: string) => {
    try {
      console.log("Importation CSV en cours...");
      
      // Parser le CSV pour extraire les tirages
      const parsedDraws = parseCSV(csv);
      
      if (!parsedDraws || parsedDraws.length === 0) {
        toast({
          title: "Erreur",
          description: "Aucune donnée valide n'a été trouvée dans le fichier CSV",
          variant: "destructive",
        });
        return;
      }
      
      console.log(`${parsedDraws.length} tirages extraits du CSV`);
      
      // Transformer les données pour les insérer dans Supabase
      const drawsToInsert = parsedDraws.map(draw => ({
        date: draw.date,
        day: draw.day,
        numbers: draw.numbers,
        special_number: draw.specialNumber
      }));
      
      // Insérer les tirages dans Supabase
      const { error } = await supabase
        .from('draws')
        .insert(drawsToInsert);
      
      if (error) {
        console.error("Erreur lors de l'importation des données:", error);
        toast({
          title: "Erreur",
          description: "Impossible d'importer les données",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Importation réussie",
        description: `${parsedDraws.length} tirages ont été importés avec succès.`,
      });
      
      onSuccess();
    } catch (error) {
      console.error("Erreur lors de l'importation CSV:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'importation CSV",
        variant: "destructive",
      });
    }
  }, [onSuccess]);
  
  return { importCSV };
};
