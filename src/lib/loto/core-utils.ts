
import { LotoDraw } from "@/types/loto";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// Fonction pour parser un fichier CSV
export const parseCSV = (csv: string): LotoDraw[] => {
  const lines = csv.split("\n");
  // Ignorer la première ligne (en-têtes)
  const data = lines.slice(1).filter(line => line.trim() !== "");
  
  return data.map(line => {
    const parts = line.split(";");
    // Format attendu: date;numero1;numero2;numero3;numero4;numero5;numeroChance
    const date = parts[0].trim();
    const numbers = parts.slice(1, 6).map(num => parseInt(num.trim()));
    const specialNumber = parseInt(parts[6].trim());
    
    // Convertir la date au format français (JJ/MM/AAAA) en format ISO (AAAA-MM-JJ)
    const dateParts = date.split('/');
    let isoDate = date;
    
    if (dateParts.length === 3) {
      // Si le format est JJ/MM/AAAA, convertir en AAAA-MM-JJ
      isoDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    }
    
    const dateObj = new Date(isoDate);
    const day = dateObj.toLocaleDateString('fr-FR', { weekday: 'long' });
    
    return {
      id: uuidv4(),
      date: isoDate, // Stocker en format ISO
      numbers,
      specialNumber,
      day
    };
  });
};

// Validation des numéros de loto
export const validateLotoNumbers = (numbers: number[], specialNumber: number): boolean => {
  // Vérifier qu'il y a 5 numéros
  if (numbers.length !== 5) return false;
  
  // Vérifier que les numéros sont entre 1 et 49
  if (!numbers.every(num => num >= 1 && num <= 49)) return false;
  
  // Vérifier que il n'y a pas de doublons
  if (new Set(numbers).size !== numbers.length) return false;
  
  // Vérifier que le numéro chance est entre 1 et 10
  if (specialNumber < 1 || specialNumber > 10) return false;
  
  return true;
};

// Formatage de la date pour l'affichage
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    
    // Vérifier si la date est valide
    if (isNaN(date.getTime())) {
      throw new Error('Date invalide');
    }
    
    return format(date, 'dd/MM/yyyy', { locale: fr });
  } catch (error) {
    console.error("Erreur de formatage de date:", error, "pour la chaîne:", dateString);
    return "Date invalide";
  }
};
