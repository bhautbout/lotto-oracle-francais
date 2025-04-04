
import { useState, useEffect } from "react";
import { useLotoData } from "@/hooks/useLotoData";
import { LotoDraw } from "@/types/loto";
import CSVImport from "@/components/CSVImport";
import DrawForm from "@/components/DrawForm";
import DrawItem from "@/components/DrawItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { formatDate } from "@/lib/loto";
import { useToast } from "@/hooks/use-toast";

const Tirages = () => {
  const { draws, isLoading, importCSV, addDraw, updateDraw, deleteDraw } = useLotoData();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDraw, setSelectedDraw] = useState<LotoDraw | null>(null);
  const { toast } = useToast();
  
  const handleAddClick = () => {
    console.log("Bouton Ajouter un tirage cliqué");
    setSelectedDraw(null);
    setShowForm(true);
  };
  
  const handleEditClick = (draw: LotoDraw) => {
    setSelectedDraw(draw);
    setShowForm(true);
  };
  
  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedDraw(null);
  };
  
  const handleFormSubmit = (draw: Omit<LotoDraw, "id">) => {
    try {
      if (selectedDraw) {
        updateDraw(selectedDraw.id, draw);
        toast({
          title: "Tirage mis à jour",
          description: "Le tirage a été mis à jour avec succès"
        });
      } else {
        addDraw(draw);
        toast({
          title: "Tirage ajouté",
          description: "Le nouveau tirage a été ajouté avec succès"
        });
      }
      setShowForm(false);
      setSelectedDraw(null);
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement du tirage",
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteClick = (draw: LotoDraw) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce tirage?")) {
      deleteDraw(draw.id);
      toast({
        title: "Tirage supprimé",
        description: "Le tirage a été supprimé avec succès"
      });
    }
  };
  
  const filteredDraws = draws.filter(draw => {
    if (!searchTerm.trim()) return true;
    
    let dateString = "";
    try {
      dateString = formatDate(draw.date);
    } catch (error) {
      console.error("Erreur lors du formatage de la date:", error);
    }
    
    const numbersString = [...draw.numbers, draw.specialNumber].join(' ');
    const searchLower = searchTerm.toLowerCase();
    
    return dateString.includes(searchTerm) || 
           numbersString.includes(searchTerm) ||
           (draw.day && draw.day.toLowerCase().includes(searchLower));
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-loto-blue">Gestion des Tirages</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Rechercher par date ou numéros..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button 
              onClick={handleAddClick} 
              className="whitespace-nowrap bg-primary hover:bg-primary/90"
              type="button"
            >
              <Plus className="mr-2 h-4 w-4" /> Ajouter un tirage
            </Button>
          </div>
          
          {filteredDraws.length > 0 ? (
            <div className="space-y-4">
              {filteredDraws.map(draw => (
                <DrawItem
                  key={draw.id}
                  draw={draw}
                  onEdit={() => handleEditClick(draw)}
                  onDelete={() => handleDeleteClick(draw)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">
                {searchTerm 
                  ? "Aucun tirage ne correspond à votre recherche" 
                  : "Aucun tirage n'a été ajouté. Importez un fichier CSV ou ajoutez des tirages manuellement."}
              </p>
            </div>
          )}
        </div>
        
        <div>
          {showForm ? (
            <DrawForm
              onSubmit={handleFormSubmit}
              initialData={selectedDraw || undefined}
              onCancel={handleFormCancel}
            />
          ) : (
            <CSVImport onImport={importCSV} isLoading={isLoading} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Tirages;
