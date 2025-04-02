
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LotoDraw } from "@/types/loto";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { validateLotoNumbers } from "@/lib/loto-utils";
import LotoBall from "./LotoBall";

interface DrawFormProps {
  onSubmit: (draw: Omit<LotoDraw, "id">) => void;
  initialData?: LotoDraw;
  onCancel: () => void;
}

const DrawForm = ({ onSubmit, initialData, onCancel }: DrawFormProps) => {
  const [date, setDate] = useState(initialData?.date || "");
  const [numbers, setNumbers] = useState<number[]>(initialData?.numbers || []);
  const [specialNumber, setSpecialNumber] = useState<number>(initialData?.specialNumber || 0);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Si initialData change, mettre à jour le formulaire
    if (initialData) {
      setDate(initialData.date);
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
    
    if (!validateLotoNumbers(numbers, specialNumber)) {
      setError("Combinaison de numéros invalide. Vérifiez que vous avez 5 numéros uniques entre 1 et 49, et un numéro chance entre 1 et 10.");
      return;
    }
    
    // Créer l'objet de tirage
    const dateObj = new Date(date);
    const day = dateObj.toLocaleDateString('fr-FR', { weekday: 'long' });
    
    onSubmit({
      date,
      numbers,
      specialNumber,
      day
    });
  };
  
  const handleNumberClick = (num: number) => {
    // Si le numéro est déjà sélectionné, le désélectionner
    if (numbers.includes(num)) {
      setNumbers(numbers.filter(n => n !== num));
      return;
    }
    
    // Sinon, l'ajouter s'il y a moins de 5 numéros sélectionnés
    if (numbers.length < 5) {
      setNumbers([...numbers, num]);
    }
  };
  
  const handleChanceClick = (num: number) => {
    // Toggle le numéro chance
    setSpecialNumber(specialNumber === num ? 0 : num);
  };
  
  // Générer la grille de numéros
  const renderNumberGrid = () => {
    const grid = [];
    for (let i = 1; i <= 49; i++) {
      grid.push(
        <LotoBall
          key={i}
          number={i}
          isSelected={numbers.includes(i)}
          onClick={() => handleNumberClick(i)}
        />
      );
    }
    return grid;
  };
  
  // Générer la grille de numéros chance
  const renderChanceGrid = () => {
    const grid = [];
    for (let i = 1; i <= 10; i++) {
      grid.push(
        <LotoBall
          key={i}
          number={i}
          isSpecial
          isSelected={specialNumber === i}
          onClick={() => handleChanceClick(i)}
        />
      );
    }
    return grid;
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
          <div className="space-y-2">
            <Label htmlFor="date">Date du tirage</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-4">
            <Label>Sélectionnez 5 numéros (1-49)</Label>
            <div className="number-table">
              {renderNumberGrid()}
            </div>
          </div>
          
          <div className="space-y-4">
            <Label>Sélectionnez 1 numéro chance (1-10)</Label>
            <div className="flex flex-wrap gap-2">
              {renderChanceGrid()}
            </div>
          </div>
          
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
