import { useState } from "react";
import LotoBall from "../LotoBall";
import { Label } from "../ui/label";

interface NumberGridProps {
  selectedNumbers: number[];
  maxSelections: number;
  onChange: (numbers: number[]) => void;
  maxNumber: number;
  isSpecial?: boolean;
}

const NumberGrid = ({
  selectedNumbers,
  maxSelections,
  onChange,
  maxNumber,
  isSpecial = false
}: NumberGridProps) => {
  const handleNumberClick = (num: number) => {
    // If the number is already selected, deselect it
    if (selectedNumbers.includes(num)) {
      onChange(selectedNumbers.filter(n => n !== num));
      return;
    }
    
    // For special number (chance), allow only one selection
    if (isSpecial) {
      onChange([num]);
      return;
    }
    
    // Otherwise, add it if there are fewer than maxSelections numbers selected
    if (selectedNumbers.length < maxSelections) {
      onChange([...selectedNumbers, num]);
    }
  };
  
  // Generate the grid of numbers
  const renderNumberGrid = () => {
    const grid = [];
    for (let i = 1; i <= maxNumber; i++) {
      grid.push(
        <LotoBall
          key={i}
          number={i}
          isSpecial={isSpecial}
          isSelected={isSpecial ? selectedNumbers[0] === i : selectedNumbers.includes(i)}
          onClick={() => handleNumberClick(i)}
        />
      );
    }
    return grid;
  };

  const label = isSpecial 
    ? `Sélectionnez 1 numéro chance (1-${maxNumber})` 
    : `Sélectionnez ${maxSelections} numéros (1-${maxNumber})`;

  return (
    <div className="space-y-4">
      <Label>{label}</Label>
      <div className={isSpecial ? "flex flex-wrap gap-2" : "number-table grid grid-cols-7 gap-2"}>
        {renderNumberGrid()}
      </div>
    </div>
  );
};

export default NumberGrid;
