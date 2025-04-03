
import React from "react";
import { LotoDraw, LotoPrediction } from "@/types/loto";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/loto";

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Détails de la méthode: {method}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {predictions.map((item, index) => (
            <div key={index} className="border p-4 rounded-md">
              <div className="flex flex-col md:flex-row justify-between mb-2">
                <h3 className="font-medium">Prédiction du {formatDate(new Date().toISOString())}</h3>
                <p className="text-gray-500">Tirage du {formatDate(item.matchingDraw.date)}</p>
              </div>
              
              <Separator className="my-2" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Numéros prédits:</h4>
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
                  <h4 className="text-sm font-medium mb-2">Tirage réel:</h4>
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
              
              <div className="mt-3 text-sm">
                <span className="font-medium">Résultat: </span>
                <span>{item.matchedNumbers.length} numéro(s) et {item.matchedSpecialNumber ? "1" : "0"} numéro chance trouvé(s)</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MethodDetailView;
