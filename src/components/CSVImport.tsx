
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUp, AlertCircle, Info, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CSVImportProps {
  onImport: (csv: string) => void;
  isLoading: boolean;
}

const CSVImport = ({ onImport, isLoading }: CSVImportProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<{ name: string, size: string } | null>(null);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setFileInfo(null);
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setError("Le fichier doit être au format CSV");
      return;
    }
    
    // Afficher des informations sur le fichier
    setFileInfo({
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + " MB"
    });
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const content = event.target.result as string;
        // Estimer le nombre de lignes (tirages)
        const lines = content.split('\n').length - 1; // -1 pour l'en-tête
        console.log(`Fichier CSV contient environ ${lines} lignes`);
        onImport(content);
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
          
          <div 
            className={`border-2 border-dashed ${isLoading ? 'border-gray-200 opacity-50' : 'border-gray-300 hover:border-primary'} rounded-lg p-6 w-full text-center cursor-pointer mb-4`} 
            onClick={isLoading ? undefined : handleClick}
          >
            {isLoading ? (
              <Loader2 className="mx-auto h-12 w-12 text-gray-400 animate-spin" />
            ) : (
              <FileUp className="mx-auto h-12 w-12 text-gray-400" />
            )}
            <p className="mt-2 text-sm text-gray-600">
              {isLoading ? 'Importation en cours...' : 'Cliquez pour sélectionner un fichier CSV'}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Format attendu: date;numéro1;numéro2;numéro3;numéro4;numéro5;numéroChance
            </p>
          </div>
          
          {fileInfo && (
            <Alert className="mb-4">
              <Info className="h-4 w-4" />
              <AlertDescription>
                Fichier: {fileInfo.name} ({fileInfo.size})<br/>
                L'importation se fait par lots de 500 tirages maximum.
              </AlertDescription>
            </Alert>
          )}
          
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Button onClick={handleClick} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importation en cours...
              </>
            ) : (
              "Importer des tirages"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CSVImport;
