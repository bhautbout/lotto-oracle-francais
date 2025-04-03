
import { LotoPrediction } from "@/types/loto";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import LotoBall from "./LotoBall";
import { Progress } from "@/components/ui/progress";
import { Brain, TrendingUp, Thermometer, Grid, List, Cpu } from "lucide-react";

interface PredictionCardProps {
  prediction: LotoPrediction;
}

const PredictionCard = ({ prediction }: PredictionCardProps) => {
  // Convertir la confiance en pourcentage
  const confidencePercentage = Math.round(prediction.confidence * 100);
  
  // Déterminer l'icône en fonction de la méthode
  const getMethodIcon = () => {
    const methodLower = prediction.method.toLowerCase();
    
    if (methodLower.includes("machine learning") || methodLower.includes("intelligence artificielle")) {
      return <Cpu className="h-5 w-5 mr-2" />;
    } else if (methodLower.includes("tendance") || methodLower.includes("trend")) {
      return <TrendingUp className="h-5 w-5 mr-2" />;
    } else if (methodLower.includes("chaud") || methodLower.includes("froid") || methodLower.includes("hot") || methodLower.includes("cold")) {
      return <Thermometer className="h-5 w-5 mr-2" />;
    } else if (methodLower.includes("pair") || methodLower.includes("fréquent")) {
      return <Grid className="h-5 w-5 mr-2" />;
    } else if (methodLower.includes("séquence") || methodLower.includes("sequence")) {
      return <List className="h-5 w-5 mr-2" />;
    } else {
      return <Brain className="h-5 w-5 mr-2" />;
    }
  };
  
  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          {getMethodIcon()}
          {prediction.method}
        </CardTitle>
        <CardDescription className="text-xs italic">
          Confiance: {confidencePercentage}%
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {prediction.numbers.map((number, idx) => (
              <LotoBall key={idx} number={number} />
            ))}
            <LotoBall number={prediction.specialNumber} isSpecial />
          </div>
          
          <div>
            <Progress value={confidencePercentage} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionCard;
