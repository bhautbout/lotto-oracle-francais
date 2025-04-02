
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUp, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CSVImportProps {
  onImport: (csv: string) => void;
  isLoading: boolean;
}

const CSVImport = ({ onImport, isLoading }: CSVImportProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setError("Le fichier doit être au format CSV");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onImport(event.target.result as string);
      }
    };
    reader.onerror = () => {
      setError("Erreur lors de la lecture du fichier");
    };
    reader.readAsText(file);
    
    // Réinitialiser l'input pour permettre la sélection du même fichier
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Importer des données</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            onChange={handleChange}
            className="hidden"
          />
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 w-full text-center hover:border-primary cursor-pointer mb-4" onClick={handleClick}>
            <FileUp className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Cliquez pour sélectionner un fichier CSV
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Format attendu: date;numéro1;numéro2;numéro3;numéro4;numéro5;numéroChance
            </p>
          </div>
          
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Button onClick={handleClick} disabled={isLoading} className="w-full">
            {isLoading ? "Importation en cours..." : "Importer des tirages"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CSVImport;
