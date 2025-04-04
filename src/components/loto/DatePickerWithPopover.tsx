
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from 'date-fns/locale';
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";

interface DatePickerWithPopoverProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}

const DatePickerWithPopover = ({ 
  date, 
  onDateChange 
}: DatePickerWithPopoverProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="date">Date du tirage</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, 'dd/MM/yyyy', { locale: fr }) : <span>Sélectionner une date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onDateChange}
            initialFocus
            locale={fr}
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePickerWithPopover;
