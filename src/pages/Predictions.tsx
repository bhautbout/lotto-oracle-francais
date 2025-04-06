import { useState } from "react";
import { useLotoData } from "@/hooks/useLotoData";
import PredictionCard from "@/components/PredictionCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { RefreshCw, AlertCircle, Brain, Database } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Predictions = () => {
  const { draws, predictions, generatePredictions } = useLotoData();
  const [count, setCount] = useState(5);
  
  const handleGenerate = () => {
    generatePredictions(count);
  };
  
  // Si aucun tirage n'est disponible
  if (draws.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-loto-blue">Prédictions</h1>
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-600 mb-4">
            Vous devez d'abord ajouter des tirages pour générer des prédictions.
          </p>
          <Button asChild>
            <Link to="/tirages">Ajouter des tirages</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  // Si le nombre de tirages est insuffisant
  if (draws.length < 10) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-loto-blue">Prédictions</h1>
        <Alert variant="warning" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Pour des prédictions fiables, il est recommandé d'avoir au moins 10 tirages. 
            Vous avez actuellement {draws.length} tirage(s).
          </AlertDescription>
        </Alert>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Générer des prédictions</CardTitle>
              <CardDescription>
                Malgré le nombre limité de données, vous pouvez générer des prédictions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Nombre de combinaisons:</span>
                  <select
                    value={count}
                    onChange={(e) => setCount(parseInt(e.target.value))}
                    className="border rounded px-2 py-1"
                  >
                    {[1, 3, 5, 10].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
                
                <Button onClick={handleGenerate} className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" /> Générer
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Ajouter plus de données</CardTitle>
              <CardDescription>
                Pour améliorer la qualité des prédictions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Plus vous avez de tirages, plus les prédictions seront précises.
                Importez des tirages supplémentaires ou ajoutez-les manuellement.
              </p>
              <Button asChild className="w-full">
                <Link to="/tirages">Gérer les tirages</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  const trainingSize = draws.length > 1000 ? 1000 : draws.length;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-loto-blue">Prédictions</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="mr-2 h-5 w-5" />
                Oracle du Loto
              </CardTitle>
              <CardDescription>
                Générez des combinaisons basées sur des algorithmes avancés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-2">Base de données</p>
                  <div className="flex items-center">
                    <Database className="mr-2 h-4 w-4 text-blue-500" />
                    <p className="font-semibold">{draws.length} tirages disponibles</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    (entraînement sur {trainingSize} tirages)
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-2">Nombre de combinaisons</p>
                  <select
                    value={count}
                    onChange={(e) => setCount(parseInt(e.target.value))}
                    className="w-full border rounded px-3 py-2"
                  >
                    {[1, 3, 5, 10, 15, 20].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
                
                <Button onClick={handleGenerate} className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" /> Générer des prédictions
                </Button>
                
                <p className="text-xs text-gray-500 italic">
                  Note: Ces prédictions ne garantissent pas de gagner au Loto et sont fournies à titre indicatif.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-3">
          {predictions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {predictions.map((prediction, index) => (
                <PredictionCard key={index} prediction={prediction} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow text-center h-full flex flex-col justify-center">
              <p className="text-gray-600 mb-4">
                Cliquez sur "Générer des prédictions" pour obtenir des combinaisons de numéros basées sur l'analyse de vos tirages.
              </p>
              <Button onClick={handleGenerate}>
                <RefreshCw className="mr-2 h-4 w-4" /> Générer maintenant
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Predictions;
