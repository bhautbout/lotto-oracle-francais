
import { LotoDraw } from "@/types/loto";

/**
 * Validates a draw to ensure it has all required fields and valid values
 */
export const validateDraw = (draw: Omit<LotoDraw, "id">): { valid: boolean; error?: string } => {
  if (!draw.date) {
    return { valid: false, error: "La date est obligatoire" };
  }
  
  if (!draw.numbers || draw.numbers.length !== 5) {
    return { valid: false, error: "Vous devez spécifier exactement 5 numéros" };
  }
  
  // Vérifier que les numéros sont entre 1 et 49
  const validNumbers = draw.numbers.every(num => num >= 1 && num <= 49);
  if (!validNumbers) {
    return { valid: false, error: "Les numéros doivent être entre 1 et 49" };
  }
  
  // Vérifier qu'il n'y a pas de doublons
  if (new Set(draw.numbers).size !== draw.numbers.length) {
    return { valid: false, error: "Les numéros doivent être uniques" };
  }
  
  // Vérifier le numéro spécial
  if (!draw.specialNumber || draw.specialNumber < 1 || draw.specialNumber > 10) {
    return { valid: false, error: "Le numéro chance doit être entre 1 et 10" };
  }
  
  return { valid: true };
};
