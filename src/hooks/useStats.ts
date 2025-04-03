
import { useState, useEffect } from "react";
import { LotoDraw, LotoStats } from "@/types/loto";
import { calculateStats } from "@/lib/loto"; // Updated import

export const useStats = (draws: LotoDraw[]) => {
  const [stats, setStats] = useState<LotoStats | null>(null);

  // Mettre à jour les statistiques quand les tirages changent
  useEffect(() => {
    if (draws.length > 0) {
      const newStats = calculateStats(draws);
      setStats(newStats);
    } else {
      setStats(null);
    }
  }, [draws]);

  return { stats };
};
