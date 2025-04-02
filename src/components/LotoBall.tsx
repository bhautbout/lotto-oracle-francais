
import { cn } from "@/lib/utils";

interface LotoBallProps {
  number: number;
  isSpecial?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
}

const LotoBall = ({
  number,
  isSpecial = false,
  isSelected = false,
  onClick,
  size = "md"
}: LotoBallProps) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-lg",
    lg: "w-14 h-14 text-xl"
  };

  return (
    <div
      className={cn(
        "loto-ball",
        isSpecial && "loto-ball-chance",
        isSelected && "loto-ball-selected",
        sizeClasses[size],
        onClick && "cursor-pointer hover:scale-110"
      )}
      onClick={onClick}
    >
      {number}
    </div>
  );
};

export default LotoBall;
