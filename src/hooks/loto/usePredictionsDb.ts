
import { LotoPrediction } from "@/types/loto";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

/**
 * Fetches all predictions from the database
 */
export const fetchPredictionsFromDb = async (limit = 10000): Promise<LotoPrediction[]> => {
  try {
    console.log(`Récupération des prédictions avec une limite de: ${limit}`);
    
    // Utilisation de la pagination pour contourner les limites de Supabase
    let allPredictions: any[] = [];
    let page = 0;
    const pageSize = 1000; // La taille maximale par page recommandée par Supabase
    let hasMore = true;
    
    while (hasMore && allPredictions.length < limit) {
      console.log(`Chargement de la page ${page + 1} des prédictions...`);
      
      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .order('created_at', { ascending: false })
        .range(page * pageSize, (page + 1) * pageSize - 1)
        .limit(pageSize);

      if (error) {
        console.error("Erreur lors de la récupération des prédictions:", error);
        throw error;
      }
      
      if (data && data.length > 0) {
        allPredictions = [...allPredictions, ...data];
        page++;
      } else {
        hasMore = false;
      }
      
      // Si on a atteint la limite ou s'il n'y a plus de données, on arrête
      if (data.length < pageSize || allPredictions.length >= limit) {
        hasMore = false;
      }
    }

    console.log(`Nombre total de prédictions récupérées: ${allPredictions.length}`);

    // Convertir les données de Supabase au format LotoPrediction
    return allPredictions.map(p => ({
      id: p.id,
      numbers: p.numbers,
      specialNumber: p.special_number,
      confidence: Number(p.confidence),
      method: p.method,
      status: p.status as "pending" | "verified" | "matched" | undefined
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des prédictions:", error);
    throw error;
  }
};

/**
 * Saves predictions to the database
 */
export const savePredictionsToDb = async (predictions: Array<{
  numbers: number[],
  special_number: number,
  confidence: number,
  method: string,
  status: string
}>): Promise<void> => {
  try {
    // Vérification pour éviter d'enregistrer un tableau vide
    if (!predictions || predictions.length === 0) {
      console.warn("Aucune prédiction à sauvegarder");
      return;
    }
    
    console.log(`Sauvegarde de ${predictions.length} prédictions...`);
    
    // Utilisation de la pagination pour éviter les limites de taille
    const batchSize = 500; // Taille recommandée pour les insertions en lot
    const batches = Math.ceil(predictions.length / batchSize);
    
    for (let i = 0; i < batches; i++) {
      const start = i * batchSize;
      const end = Math.min(start + batchSize, predictions.length);
      const batch = predictions.slice(start, end);
      
      console.log(`Sauvegarde du lot ${i + 1}/${batches} (${batch.length} prédictions)`);
      
      const { error } = await supabase
        .from('predictions')
        .insert(batch);

      if (error) {
        console.error(`Erreur lors de l'enregistrement du lot ${i + 1}:`, error);
        throw error;
      }
    }
    
    console.log("Sauvegarde des prédictions terminée avec succès");
  } catch (error) {
    console.error("Erreur lors de l'enregistrement des prédictions:", error);
    throw error;
  }
};
