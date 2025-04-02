
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useRealtimeUpdates = (
  onDrawsChange: () => void,
  onPredictionsChange: () => void
) => {
  // Subscribe to real-time updates
  useEffect(() => {
    const drawsChannel = supabase
      .channel('draws-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'draws' 
        }, 
        () => {
          onDrawsChange();
        }
      )
      .subscribe();

    const predictionsChannel = supabase
      .channel('predictions-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'predictions' 
        }, 
        () => {
          onPredictionsChange();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(drawsChannel);
      supabase.removeChannel(predictionsChannel);
    };
  }, [onDrawsChange, onPredictionsChange]);
};
