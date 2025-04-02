
import { LotoStats } from "@/types/loto";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StatsChartProps {
  stats: LotoStats;
}

const StatsChart = ({ stats }: StatsChartProps) => {
  // Convertir les données de fréquence pour les numéros normaux
  const numberFrequencyData = Object.entries(stats.numberFrequency)
    .map(([number, frequency]) => ({
      number: parseInt(number),
      frequency
    }))
    .sort((a, b) => a.number - b.number);
  
  // Convertir les données de fréquence pour le numéro chance
  const specialNumberData = Object.entries(stats.specialNumberFrequency)
    .map(([number, frequency]) => ({
      number: parseInt(number),
      frequency
    }))
    .sort((a, b) => a.number - b.number);
  
  // Convertir les données pour le jour de tirage
  const dayFrequencyData = stats.dayFrequency 
    ? Object.entries(stats.dayFrequency)
        .map(([day, frequency]) => ({
          name: day,
          value: frequency
        }))
    : [];
  
  // Couleurs pour les graphiques
  const colors = ["#0055a4", "#ef4135", "#4CAF50", "#FF9800", "#9C27B0", "#607D8B"];
  const pieColors = ["#0055a4", "#ef4135", "#4CAF50", "#FF9800", "#9C27B0", "#607D8B", "#3F51B5"];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Analyse statistique</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="numbers">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="numbers">Numéros</TabsTrigger>
            <TabsTrigger value="chance">Numéro Chance</TabsTrigger>
            <TabsTrigger value="days">Jours</TabsTrigger>
          </TabsList>
          
          <TabsContent value="numbers" className="pt-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={numberFrequencyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="number" 
                    interval={4} 
                    label={{ value: 'Numéro', position: 'insideBottom', offset: -5 }} 
                  />
                  <YAxis 
                    label={{ value: 'Fréquence', angle: -90, position: 'insideLeft' }} 
                  />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="frequency" fill="#0055a4" name="Fréquence" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="chance" className="pt-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={specialNumberData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="number" 
                    label={{ value: 'Numéro Chance', position: 'insideBottom', offset: -5 }} 
                  />
                  <YAxis 
                    label={{ value: 'Fréquence', angle: -90, position: 'insideLeft' }} 
                  />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="frequency" fill="#ef4135" name="Fréquence" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="days" className="pt-4">
            {dayFrequencyData.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dayFrequencyData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {dayFrequencyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} tirages`, 'Fréquence']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center">
                <p className="text-gray-500">Aucune donnée disponible sur les jours de tirage</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StatsChart;
