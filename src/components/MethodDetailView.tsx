
import React, { useState } from "react";
import { LotoDraw, LotoPrediction } from "@/types/loto";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/loto";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight, Trophy, Target, Percent, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MethodDetailViewProps {
  method: string;
  predictions: Array<{
    prediction: LotoPrediction;
    matchingDraw: LotoDraw;
    matchedNumbers: number[];
    matchedSpecialNumber: boolean;
  }>;
}

const MethodDetailView = ({ method, predictions }: MethodDetailViewProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(predictions.length / itemsPerPage);
  
  if (!predictions.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Détails de la méthode: {method}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Aucune prédiction avec résultat disponible</p>
        </CardContent>
      </Card>
    );
  }

  // Calculer le nombre de pages
  const pageStart = (currentPage - 1) * itemsPerPage;
  const currentPredictions = predictions.slice(pageStart, pageStart + itemsPerPage);
  
  // Statistiques de performance pour la méthode actuelle
  const totalMatchedNumbers = predictions.reduce((acc, item) => acc + item.matchedNumbers.length, 0);
  const totalMatchedSpecial = predictions.filter(item => item.matchedSpecialNumber).length;
  const averageMatchedNumbers = totalMatchedNumbers / predictions.length;
  const averageMatchedSpecial = totalMatchedSpecial / predictions.length;
  
  // Calcul des gains simulés (pour illustration)
  const calculateWinCategory = (matchedNumbers: number, matchedSpecial: boolean) => {
    if (matchedNumbers === 5 && matchedSpecial) return "Jackpot";
    if (matchedNumbers === 5) return "Rang 2";
    if (matchedNumbers === 4 && matchedSpecial) return "Rang 3";
    if (matchedNumbers === 4) return "Rang 4";
    if (matchedNumbers === 3 && matchedSpecial) return "Rang 5";
    if (matchedNumbers === 3) return "Rang 6";
    if (matchedNumbers === 2 && matchedSpecial) return "Rang 7";
    if (matchedNumbers === 1 && matchedSpecial) return "Rang 8";
    if (matchedSpecial) return "Rang 9";
    return "Aucun gain";
  };
  
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl flex items-center">
          <Target className="h-5 w-5 mr-2 text-loto-blue" />
          Détails de la méthode: {method}
        </CardTitle>
        <CardDescription>
          Performance sur {predictions.length} prédictions analysées
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-4 rounded-lg">
            <div className="text-sm text-muted-foreground">Numéros trouvés</div>
            <div className="text-2xl font-bold flex items-center">
              {totalMatchedNumbers}
              <span className="text-xs text-muted-foreground ml-2">
                ({(averageMatchedNumbers).toFixed(2)} par tirage)
              </span>
            </div>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg">
            <div className="text-sm text-muted-foreground">Numéros chance trouvés</div>
            <div className="text-2xl font-bold flex items-center">
              {totalMatchedSpecial}
              <span className="text-xs text-muted-foreground ml-2">
                ({(averageMatchedSpecial).toFixed(2)} par tirage)
              </span>
            </div>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg">
            <div className="text-sm text-muted-foreground">Meilleur résultat</div>
            <div className="text-2xl font-bold">
              {Math.max(...predictions.map(p => p.matchedNumbers.length))} numéros
            </div>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg">
            <div className="text-sm text-muted-foreground">Taux de numéros chance</div>
            <div className="text-2xl font-bold flex items-center">
              {(totalMatchedSpecial / predictions.length * 100).toFixed(1)}%
            </div>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="space-y-6">
          {currentPredictions.map((item, index) => {
            const winCategory = calculateWinCategory(item.matchedNumbers.length, item.matchedSpecialNumber);
            const isWin = winCategory !== "Aucun gain";
            
            return (
              <div key={index} className={`border ${isWin ? 'border-amber-200' : ''} p-4 rounded-md shadow-sm`}>
                <div className="flex flex-col md:flex-row justify-between mb-2">
                  <h3 className="font-medium flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Tirage du {formatDate(item.matchingDraw.date)}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Percent className="h-4 w-4" />
                    <span>Confiance: {(item.prediction.confidence * 100).toFixed(0)}%</span>
                  </div>
                </div>
                
                <Separator className="my-2" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <Target className="h-3 w-3 mr-1" />
                      Numéros prédits:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {item.prediction.numbers.map((number, i) => (
                        <span 
                          key={i} 
                          className={`inline-flex items-center justify-center rounded-full w-8 h-8 text-sm
                            ${item.matchedNumbers.includes(number) 
                              ? "bg-red-500 text-white" 
                              : "bg-gray-100 text-gray-700"}`}
                        >
                          {number}
                        </span>
                      ))}
                      <span 
                        className={`inline-flex items-center justify-center rounded-full w-8 h-8 text-sm
                          ${item.matchedSpecialNumber 
                            ? "bg-red-500 text-white" 
                            : "bg-amber-100 text-amber-700"}`}
                      >
                        {item.prediction.specialNumber}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <Trophy className="h-3 w-3 mr-1" />
                      Tirage réel:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {item.matchingDraw.numbers.map((number, i) => (
                        <span 
                          key={i} 
                          className="inline-flex items-center justify-center rounded-full w-8 h-8 text-sm bg-gray-100 text-gray-700"
                        >
                          {number}
                        </span>
                      ))}
                      <span 
                        className="inline-flex items-center justify-center rounded-full w-8 h-8 text-sm bg-amber-100 text-amber-700"
                      >
                        {item.matchingDraw.specialNumber}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 flex flex-wrap justify-between items-center">
                  <div className="text-sm">
                    <span className="font-medium">Résultat: </span>
                    <span>{item.matchedNumbers.length} numéro(s) et {item.matchedSpecialNumber ? "1" : "0"} numéro chance trouvé(s)</span>
                  </div>
                  <Badge 
                    className={isWin ? "bg-amber-500" : "bg-gray-200 text-gray-700"}
                  >
                    {winCategory}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <Pagination>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center mx-2">
                <span className="text-sm">
                  Page {currentPage} sur {totalPages}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MethodDetailView;
