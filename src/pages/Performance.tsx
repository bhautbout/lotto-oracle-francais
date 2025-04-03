
import React, { useEffect } from "react";
import { useLotoData } from "@/hooks/useLotoData";
import { useModelPerformance } from "@/hooks/loto/useModelPerformance";
import ModelPerformanceTable from "@/components/ModelPerformanceTable";
import MethodDetailView from "@/components/MethodDetailView";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, TrendingUp } from "lucide-react";

const Performance = () => {
  const { draws, predictions, fetchPredictions } = useLotoData();
  const { performance, selectedMethod, setSelectedMethod } = useModelPerformance(draws, predictions);

  useEffect(() => {
    // S'assurer que les prédictions sont chargées
    fetchPredictions();
  }, [fetchPredictions]);

  // Trouver les détails de la méthode sélectionnée
  const selectedMethodDetails = selectedMethod
    ? performance.find(p => p.method === selectedMethod)
    : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-loto-blue">Performance des modèles</h1>

      {draws.length < 500 ? (
        <Alert variant="warning" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Pour une analyse complète, il est recommandé d'avoir au moins 500 tirages. 
            Vous avez actuellement {draws.length} tirage(s).
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Performance comparative des modèles
            </CardTitle>
            <CardDescription>
              Analyse de la performance des différentes méthodes de prédiction sur les 500 derniers tirages
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
          <MethodDetailView 
            method={selectedMethodDetails.method} 
            predictions={selectedMethodDetails.predictions} 
          />
        )}
      </div>
    </div>
  );
};

export default Performance;
