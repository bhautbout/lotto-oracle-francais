
import { LotoPrediction } from "@/types/loto";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LotoBall from "./LotoBall";
import { Progress } from "@/components/ui/progress";

interface PredictionCardProps {
  prediction: LotoPrediction;
}

const PredictionCard = ({ prediction }: PredictionCardProps) => {
  // Convertir la confiance en pourcentage
  const confidencePercentage = Math.round(prediction.confidence * 100);
  
  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{prediction.method}</CardTitle>
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
            <div className="flex justify-between text-sm mb-1">
              <span>Confiance</span>
              <span>{confidencePercentage}%</span>
            </div>
            <Progress value={confidencePercentage} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionCard;
