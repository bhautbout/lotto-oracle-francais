
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format, parse } from "date-fns";
import { fr } from 'date-fns/locale';
import { cn } from "@/lib/utils";

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
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'dd/MM/yyyy', { locale: fr }) : <span>Sélectionner une date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  locale={fr}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-4">
            <Label>Sélectionnez 5 numéros (1-49)</Label>
            <div className="number-table grid grid-cols-7 gap-2">
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
