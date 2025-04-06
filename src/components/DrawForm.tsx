
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LotoDraw } from "@/types/loto";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { validateLotoNumbers } from "@/lib/loto";
import NumberGrid from "./loto/NumberGrid";
import DatePickerWithPopover from "./loto/DatePickerWithPopover";
import { format } from "date-fns";

interface DrawFormProps {
  onSubmit: (draw: Omit<LotoDraw, "id">) => void;
  initialData?: LotoDraw;
  onCancel: () => void;
}

const DrawForm = ({ onSubmit, initialData, onCancel }: DrawFormProps) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [numbers, setNumbers] = useState<number[]>(initialData?.numbers || []);
  const [specialNumber, setSpecialNumber] = useState<number>(initialData?.specialNumber || 0);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Si initialData change, mettre à jour le formulaire
    if (initialData) {
      if (initialData.date) {
        try {
          // Convertir depuis le format ISO stocké
          const parsedDate = new Date(initialData.date);
          if (!isNaN(parsedDate.getTime())) {
            setDate(parsedDate);
          }
        } catch (e) {
          console.error("Erreur lors de la conversion de la date:", e);
        }
      }
      setNumbers(initialData.numbers);
      setSpecialNumber(initialData.specialNumber);
    }
  }, [initialData]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validation de base
    if (!date) {
      setError("La date est obligatoire");
      return;
    }
    
    if (numbers.length !== 5) {
      setError("Vous devez sélectionner exactement 5 numéros principaux");
      return;
    }
    
    if (specialNumber <= 0 || specialNumber > 10) {
      setError("Le numéro chance doit être entre 1 et 10");
      return;
    }
    
    if (!validateLotoNumbers(numbers, specialNumber)) {
      setError("Combinaison de numéros invalide. Vérifiez que vous avez 5 numéros uniques entre 1 et 49, et un numéro chance entre 1 et 10.");
      return;
    }
    
    // Créer l'objet de tirage
    const day = date.toLocaleDateString('fr-FR', { weekday: 'long' });
    const formattedDate = format(date, 'yyyy-MM-dd'); // Format ISO pour le stockage
    
    onSubmit({
      date: formattedDate,
      numbers,
      specialNumber,
      day
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">
          {initialData ? "Modifier le tirage" : "Ajouter un tirage"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <DatePickerWithPopover 
            date={date} 
            onDateChange={setDate} 
          />
          
          <NumberGrid 
            selectedNumbers={numbers}
            maxSelections={5}
            onChange={setNumbers}
            maxNumber={49}
          />
          
          <NumberGrid 
            selectedNumbers={specialNumber ? [specialNumber] : []}
            maxSelections={1}
            onChange={(nums) => setSpecialNumber(nums[0] || 0)}
            maxNumber={10}
            isSpecial
          />
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="flex space-x-2">
            <Button type="submit" className="flex-1">
              {initialData ? "Mettre à jour" : "Ajouter"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DrawForm;
