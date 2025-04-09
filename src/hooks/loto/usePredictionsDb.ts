
import { LotoPrediction } from "@/types/loto";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

/**
 * Fetches all predictions from the database
 */
export const fetchPredictionsFromDb = async (limit = 5000): Promise<LotoPrediction[]> => {
  try {
    console.log(`Récupération des prédictions avec une limite de: ${limit}`);
    const { data, error } = await supabase
      .from('predictions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Erreur lors de la récupération des prédictions:", error);
      throw error;
    }

    console.log(`Nombre de prédictions récupérées: ${data?.length || 0}`);

    // Convertir les données de Supabase au format LotoPrediction
    return data.map(p => ({
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
    const { error } = await supabase
      .from('predictions')
      .insert(predictions);

    if (error) {
      console.error("Erreur lors de l'enregistrement des prédictions:", error);
      throw error;
    }
  } catch (error) {
    console.error("Erreur lors de l'enregistrement des prédictions:", error);
    throw error;
  }
};
