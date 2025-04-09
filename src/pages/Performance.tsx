
import React, { useEffect, useState } from "react";
import { useLotoData } from "@/hooks/useLotoData";
import { useModelPerformance } from "@/hooks/loto/useModelPerformance";
import { getAvailableMethods } from "@/hooks/loto/usePredictionGenerator";
import ModelPerformanceTable from "@/components/ModelPerformanceTable";
import MethodDetailView from "@/components/MethodDetailView";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, TrendingUp, Loader2, Plus, RefreshCw } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";

const Performance = () => {
  const { draws, predictions, fetchPredictions, generatePredictions, isLoading } = useLotoData();
  const { performance, selectedMethod, setSelectedMethod } = useModelPerformance(draws, predictions);
  const [showMethodSelector, setShowMethodSelector] = useState(false);
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const availableMethods = getAvailableMethods();

  // Charger toutes les prédictions disponibles au lieu de se limiter à 1000
  useEffect(() => {
    console.log("Chargement des prédictions pour la page performance");
    loadAllPredictions();
  }, []);

  // Fonction pour charger toutes les prédictions
  const loadAllPredictions = async () => {
    setIsRefreshing(true);
    await fetchPredictions(5000); // Augmentation du nombre de prédictions récupérées
    setIsRefreshing(false);
  };

  const selectedMethodDetails = selectedMethod
    ? performance.find(p => p.method === selectedMethod)
    : null;

  const toggleMethodSelection = (methodId: string) => {
    setSelectedMethods(prev => 
      prev.includes(methodId) 
        ? prev.filter(id => id !== methodId)
        : [...prev, methodId]
    );
  };

  const handleGeneratePredictions = () => {
    if (selectedMethods.length === 0) {
      toast({
        title: "Sélection requise",
        description: "Veuillez sélectionner au moins une méthode de prédiction",
        variant: "destructive",
      });
      return;
    }

    generatePredictions({ count: selectedMethods.length, specificMethods: selectedMethods });
    setShowMethodSelector(false);
    toast({
      title: "Génération en cours",
      description: `Génération de ${selectedMethods.length} nouvelles prédictions...`,
    });
    
    // Recharger les prédictions après un court délai pour permettre à la base de données de se mettre à jour
    setTimeout(loadAllPredictions, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-loto-blue">Performance des modèles</h1>
      <p className="text-gray-500 mb-6">
        Analyse comparative des différentes méthodes de prédiction sur {predictions.length} prédictions
      </p>

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <Button 
            onClick={loadAllPredictions} 
            disabled={isRefreshing || isLoading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualiser les données
          </Button>
          
          {draws.length < 500 ? (
            <Alert variant="warning" className="mb-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Pour une analyse complète, il est recommandé d'avoir au moins 500 tirages. 
                Vous avez actuellement {draws.length} tirage(s).
              </AlertDescription>
            </Alert>
          ) : null}
        </div>
        
        <Button 
          onClick={() => setShowMethodSelector(!showMethodSelector)} 
          className="bg-loto-blue hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Générer avec méthodes spécifiques
        </Button>
      </div>

      {showMethodSelector && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Sélectionner les méthodes de prédiction</CardTitle>
            <CardDescription>
              Choisissez les méthodes que vous souhaitez utiliser pour générer de nouvelles prédictions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {availableMethods.map((method) => (
                <div key={method.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={method.id}
                    checked={selectedMethods.includes(method.id)}
                    onCheckedChange={() => toggleMethodSelection(method.id)}
                  />
                  <label
                    htmlFor={method.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {method.name}
                  </label>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowMethodSelector(false)}>
                Annuler
              </Button>
              <Button onClick={handleGeneratePredictions}>
                Générer les prédictions
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {(isLoading || isRefreshing) && (
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
