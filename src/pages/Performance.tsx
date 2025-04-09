
import React, { useEffect } from "react";
import { useLotoData } from "@/hooks/useLotoData";
import { useModelPerformance } from "@/hooks/loto/useModelPerformance";
import ModelPerformanceTable from "@/components/ModelPerformanceTable";
import MethodDetailView from "@/components/MethodDetailView";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, TrendingUp, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Performance = () => {
  const { draws, predictions, fetchPredictions, isLoading } = useLotoData();
  const { performance, selectedMethod, setSelectedMethod } = useModelPerformance(draws, predictions);

  // Récupérer un nombre plus important de prédictions au chargement
  useEffect(() => {
    // Chargement de 1000 prédictions max pour avoir une analyse plus complète
    console.log("Chargement des prédictions pour la page performance");
    fetchPredictions(1000);
  }, [fetchPredictions]);

  // Trouver les détails de la méthode sélectionnée
  const selectedMethodDetails = selectedMethod
    ? performance.find(p => p.method === selectedMethod)
    : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-loto-blue">Performance des modèles</h1>
      <p className="text-gray-500 mb-6">
        Analyse comparative des différentes méthodes de prédiction sur {predictions.length} prédictions
      </p>

      {draws.length < 500 ? (
        <Alert variant="warning" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Pour une analyse complète, il est recommandé d'avoir au moins 500 tirages. 
            Vous avez actuellement {draws.length} tirage(s).
          </AlertDescription>
        </Alert>
      ) : null}

      {isLoading && (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-loto-blue" />
          <span className="ml-2">Analyse des prédictions en cours...</span>
        </div>
      )}

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Performance comparative des modèles
            </CardTitle>
            <CardDescription>
              Analyse de {performance.reduce((acc, method) => acc + method.totalPredictions, 0)} prédictions réparties sur {performance.length} méthode(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ModelPerformanceTable 
              performance={performance} 
              onSelectMethod={setSelectedMethod}
              selectedMethod={selectedMethod}
            />
          </CardContent>
        </Card>

        {selectedMethodDetails && (
          <>
            <Separator />
            <MethodDetailView 
              method={selectedMethodDetails.method} 
              predictions={selectedMethodDetails.predictions} 
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Performance;
