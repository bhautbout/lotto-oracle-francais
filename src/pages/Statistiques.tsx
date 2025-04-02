
import { useLotoData } from "@/hooks/useLotoData";
import StatsChart from "@/components/StatsChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LotoBall from "@/components/LotoBall";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDate } from "@/lib/loto-utils";

const Statistiques = () => {
  const { draws, stats } = useLotoData();
  
  // Si aucun tirage n'est disponible
  if (draws.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-loto-blue">Statistiques</h1>
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-600 mb-4">
            Aucun tirage n'est disponible pour calculer des statistiques.
          </p>
          <Button asChild>
            <Link to="/tirages">Ajouter des tirages</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  // Si les statistiques ne sont pas encore calculées
  if (!stats) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-loto-blue">Statistiques</h1>
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-600">Calcul des statistiques en cours...</p>
        </div>
      </div>
    );
  }
  
  // Trouver les 5 numéros les plus fréquents
  const topNumbers = Object.entries(stats.numberFrequency)
    .map(([num, freq]) => ({ num: parseInt(num), freq }))
    .sort((a, b) => b.freq - a.freq)
    .slice(0, 5)
    .map(item => item.num);
  
  // Trouver le numéro chance le plus fréquent
  const topSpecialNumber = Object.entries(stats.specialNumberFrequency)
    .map(([num, freq]) => ({ num: parseInt(num), freq }))
    .sort((a, b) => b.freq - a.freq)[0]?.num;
  
  // Premier et dernier tirage
  const firstDraw = draws.length > 0 ? draws[draws.length - 1] : null;
  const lastDraw = draws.length > 0 ? draws[0] : null;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-loto-blue">Statistiques</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <StatsChart stats={stats} />
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Résumé des données</CardTitle>
              <CardDescription>Aperçu de votre base de données</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Nombre de tirages</p>
                  <p className="text-2xl font-semibold">{draws.length}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Premier tirage</p>
                  <p className="font-medium">
                    {firstDraw ? formatDate(firstDraw.date) : "-"}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Dernier tirage</p>
                  <p className="font-medium">
                    {lastDraw ? formatDate(lastDraw.date) : "-"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Numéros les plus fréquents</CardTitle>
              <CardDescription>Basé sur l'analyse statistique</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-2">Top 5 des numéros</p>
                  <div className="flex flex-wrap gap-2">
                    {topNumbers.map(num => (
                      <LotoBall key={num} number={num} />
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-2">Numéro chance le plus fréquent</p>
                  {topSpecialNumber && (
                    <LotoBall number={topSpecialNumber} isSpecial />
                  )}
                </div>
                
                <Button asChild className="w-full mt-4">
                  <Link to="/predictions">
                    Générer des prédictions <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Statistiques;
