
import { parseCSV } from "@/lib/loto"; // Updated import
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useCSVImport = (onImportComplete: () => void) => {
  const importCSV = async (csv: string) => {
    try {
      const parsedDraws = parseCSV(csv);
      
      if (parsedDraws.length === 0) {
        throw new Error("Aucune donnée n'a pu être importée");
      }
      
      console.log(`Nombre de tirages à importer: ${parsedDraws.length}`);
      
      // Optimisation: insérer les tirages par lots pour éviter les limitations
      const batchSize = 500; // Taille de lot recommandée
      const batches = [];
      
      for (let i = 0; i < parsedDraws.length; i += batchSize) {
        batches.push(parsedDraws.slice(i, i + batchSize));
      }
      
      console.log(`Nombre de lots à traiter: ${batches.length}`);
      
      let successCount = 0;
      let errorCount = 0;
      
      // Traiter les lots séquentiellement
      await Promise.all(
        batches.map(async (batch, index) => {
          try {
            console.log(`Traitement du lot ${index + 1}/${batches.length} (${batch.length} tirages)`);
            
            const { error } = await supabase
              .from('draws')
              .insert(
                batch.map(draw => ({
                  date: draw.date,
                  day: draw.day,
                  numbers: draw.numbers,
                  special_number: draw.specialNumber
                }))
              );
              
            if (error) {
              console.error(`Erreur lot ${index + 1}:`, error);
              errorCount += batch.length;
              return;
            }
            
            successCount += batch.length;
            console.log(`Lot ${index + 1} traité avec succès`);
          } catch (error) {
            console.error(`Exception lot ${index + 1}:`, error);
            errorCount += batch.length;
          }
        })
      );

      if (successCount > 0) {
        toast({
          title: "Importation réussie",
          description: `${successCount} tirages ont été importés${errorCount > 0 ? ` (${errorCount} échecs)` : ''}.`,
        });
      } else {
        toast({
          title: "Échec de l'importation",
          description: "Aucun tirage n'a pu être importé.",
          variant: "destructive",
        });
      }
      
      onImportComplete();
    } catch (error) {
      console.error("Erreur d'analyse du CSV:", error);
      toast({
        title: "Erreur d'importation",
        description: error instanceof Error ? error.message : "Format de fichier invalide",
        variant: "destructive",
      });
    }
  };

  return { importCSV };
};
