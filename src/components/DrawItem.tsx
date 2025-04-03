import { LotoDraw } from "@/types/loto";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import LotoBall from "./LotoBall";
import { formatDate } from "@/lib/loto";

interface DrawItemProps {
  draw: LotoDraw;
  onEdit: () => void;
  onDelete: () => void;
}

const DrawItem = ({ draw, onEdit, onDelete }: DrawItemProps) => {
  // Assurer que la date est affichée correctement
  const displayDate = draw.date ? formatDate(draw.date) : "Date inconnue";
  
  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col">
            <div className="text-lg font-medium mb-2">
              Tirage du {displayDate}
            </div>
            {draw.day && (
              <div className="text-sm text-gray-500 mb-2">{draw.day}</div>
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            {draw.numbers.map((number, idx) => (
              <LotoBall key={idx} number={number} size="sm" />
            ))}
            <LotoBall number={draw.specialNumber} isSpecial size="sm" />
          </div>

          <div className="flex space-x-2 ml-auto">
            <Button
              variant="outline"
              size="icon"
              onClick={onEdit}
              className="h-8 w-8"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={onDelete}
              className="h-8 w-8"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DrawItem;
