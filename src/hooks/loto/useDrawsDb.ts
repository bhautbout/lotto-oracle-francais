
import { supabase } from "@/integrations/supabase/client";
import { LotoDraw } from "@/types/loto";
import { toast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";

// Define types based on Database type
type DrawsRow = Database['public']['Tables']['draws']['Row'];

/**
 * Fetches all draw data from the database using pagination
 */
export const fetchDrawsFromDb = async (): Promise<LotoDraw[]> => {
  try {
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
    return allDraws.map((draw: DrawsRow) => ({
      id: draw.id,
      date: draw.date,
      day: draw.day || undefined,
      numbers: draw.numbers,
      specialNumber: draw.special_number
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des tirages:", error);
    throw error;
  }
};

/**
 * Adds a new draw to the database
 */
export const addDrawToDb = async (draw: Omit<LotoDraw, "id">): Promise<DrawsRow> => {
  // Vérifier que tous les champs nécessaires sont présents
  if (!draw.date || !draw.numbers || draw.numbers.length !== 5 || !draw.specialNumber) {
    console.error("Données de tirage invalides:", draw);
    throw new Error("Données de tirage incomplètes ou invalides");
  }

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
  return data;
};

/**
 * Updates an existing draw in the database
 */
export const updateDrawInDb = async (id: string, updatedDraw: Omit<LotoDraw, "id">): Promise<void> => {
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
};

/**
 * Deletes a draw from the database
 */
export const deleteDrawFromDb = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('draws')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Erreur Supabase:", error);
    throw error;
  }
  
  console.log("Tirage supprimé avec succès");
};
