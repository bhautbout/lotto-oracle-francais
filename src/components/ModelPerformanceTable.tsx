
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Award, Star } from "lucide-react";

type MethodPerformance = {
  method: string;
  totalPredictions: number;
  numbersFound: number;
  specialNumbersFound: number;
  averageNumbers: number;
  averageSpecialNumbers: number;
};

interface ModelPerformanceTableProps {
  performance: MethodPerformance[];
  onSelectMethod: (method: string) => void;
  selectedMethod: string | null;
}

const ModelPerformanceTable = ({ 
  performance, 
  onSelectMethod,
  selectedMethod
}: ModelPerformanceTableProps) => {
  if (!performance.length) {
    return (
      <div className="text-center p-6 bg-gray-50 rounded-lg">
        <p className="text-gray-500">Aucune donnée de performance disponible</p>
      </div>
    );
  }

  return (
    <Table>
      <TableCaption>Analyse des performances sur les 500 derniers tirages</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[250px]">Méthode de prédiction</TableHead>
          <TableHead className="text-center">Prédictions</TableHead>
          <TableHead className="text-center">Numéros trouvés</TableHead>
          <TableHead className="text-center">Numéros chance trouvés</TableHead>
          <TableHead className="text-center">Moyenne numéros</TableHead>
          <TableHead className="text-center">Moyenne numéros chance</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {performance.map((method, index) => (
          <TableRow 
            key={method.method} 
            className={index === 0 ? "bg-amber-50" : ""}
          >
            <TableCell className="font-medium flex items-center gap-2">
              {index === 0 && <Award className="h-4 w-4 text-amber-500" />}
              {method.method}
            </TableCell>
            <TableCell className="text-center">{method.totalPredictions}</TableCell>
            <TableCell className="text-center">{method.numbersFound}</TableCell>
            <TableCell className="text-center">{method.specialNumbersFound}</TableCell>
            <TableCell className="text-center">{method.averageNumbers.toFixed(2)}</TableCell>
            <TableCell className="text-center">{method.averageSpecialNumbers.toFixed(2)}</TableCell>
            <TableCell className="text-center">
              <Button 
                variant={selectedMethod === method.method ? "default" : "outline"} 
                size="sm"
                onClick={() => onSelectMethod(method.method)}
              >
                {selectedMethod === method.method ? "Sélectionné" : "Détails"}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ModelPerformanceTable;
