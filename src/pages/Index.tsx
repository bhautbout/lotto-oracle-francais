
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileUp, BarChart2, Calendar, Brain } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center text-center mb-12 space-y-4">
        <h1 className="text-4xl font-bold text-loto-blue animate-fade-in">
          Loto Oracle <span className="text-loto-red">Français</span>
        </h1>
        <p className="text-xl max-w-2xl mx-auto text-gray-600">
          Analysez les tirages du Loto Français, générez des statistiques et obtenez des prédictions basées sur des analyses avancées.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card className="hover:shadow-lg transition-all animate-bounce-in">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <FileUp className="mr-2 h-5 w-5 text-loto-blue" />
              Importer
            </CardTitle>
            <CardDescription>
              Importez des données à partir d'un fichier CSV
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Chargez l'historique des tirages du Loto pour commencer votre analyse.
            </p>
            <Button asChild className="w-full">
              <Link to="/tirages">Importer des données</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all animate-bounce-in" style={{ animationDelay: "0.1s" }}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-loto-blue" />
              Tirages
            </CardTitle>
            <CardDescription>
              Gérez votre base de données de tirages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Ajoutez, modifiez et supprimez des tirages de votre base de données.
            </p>
            <Button asChild className="w-full">
              <Link to="/tirages">Gérer les tirages</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all animate-bounce-in" style={{ animationDelay: "0.2s" }}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <BarChart2 className="mr-2 h-5 w-5 text-loto-blue" />
              Statistiques
            </CardTitle>
            <CardDescription>
              Visualisez les données statistiques
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Analysez la fréquence des numéros et découvrez les tendances.
            </p>
            <Button asChild className="w-full">
              <Link to="/statistiques">Voir les statistiques</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all animate-bounce-in" style={{ animationDelay: "0.3s" }}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Brain className="mr-2 h-5 w-5 text-loto-blue" />
              Prédictions
            </CardTitle>
            <CardDescription>
              Obtenez des prédictions intelligentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Générez des combinaisons basées sur l'analyse statistique et l'IA.
            </p>
            <Button asChild className="w-full">
              <Link to="/predictions">Générer des prédictions</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="bg-loto-lightblue rounded-lg p-6 shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-loto-blue">Comment ça marche?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-md shadow">
            <h3 className="font-medium text-lg mb-2">1. Importez vos données</h3>
            <p className="text-gray-600">
              Commencez par importer l'historique des tirages à partir d'un fichier CSV ou ajoutez-les manuellement.
            </p>
          </div>
          <div className="bg-white p-4 rounded-md shadow">
            <h3 className="font-medium text-lg mb-2">2. Analysez les statistiques</h3>
            <p className="text-gray-600">
              Visualisez les tendances et la fréquence des numéros grâce à nos graphiques interactifs.
            </p>
          </div>
          <div className="bg-white p-4 rounded-md shadow">
            <h3 className="font-medium text-lg mb-2">3. Obtenez des prédictions</h3>
            <p className="text-gray-600">
              Générez des combinaisons de numéros basées sur l'analyse statistique et notre système d'IA.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
