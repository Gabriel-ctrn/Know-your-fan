import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Check } from "lucide-react";

export function GameLevel() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const updateGamificationMutation = useMutation({
    mutationFn: async ({ level, points }: { level: string, points: number }) => {
      const res = await apiRequest("POST", "/api/user/gamification", { level, points });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Nível atualizado",
        description: "Seu nível de gamificação foi atualizado com sucesso!"
      });
    }
  });
  
  if (!user) {
    return null;
  }

  const gamificationLevel = user.gamificationLevel || "irritado";
  const points = user.gamificationPoints || 0;
  
  // Calculate progress percentage based on level
  let progress = 0;
  let maxPoints = 2500;
  
  switch (gamificationLevel) {
    case "irritado":
      maxPoints = 1000;
      progress = (points / maxPoints) * 100;
      break;
    case "bravo":
      maxPoints = 2000;
      progress = (points / maxPoints) * 100;
      break;
    case "furioso":
      maxPoints = 2500;
      progress = (points / maxPoints) * 100;
      break;
  }
  
  // Determine which levels have been achieved
  const isIrritado = true; // Always true as it's the first level
  const isBravo = gamificationLevel === "bravo" || gamificationLevel === "furioso";
  const isFurioso = gamificationLevel === "furioso";

  return (
    <div className="bg-black/50 rounded-lg p-6 mb-8">
      <h3 className="font-rajdhani font-bold text-xl mb-4">Seu Nível FURIA</h3>
      
      <div className="flex items-center mb-4">
        <div className="w-16 h-16 flex items-center justify-center bg-furia-red rounded-full mr-4">
          <i className="ri-fire-fill text-3xl text-white"></i>
        </div>
        <div>
          <div className="font-rajdhani font-bold text-xl text-white">{gamificationLevel.toUpperCase()}</div>
          <div className="text-accent-yellow text-sm">
            Nível {gamificationLevel === "irritado" ? "1" : gamificationLevel === "bravo" ? "2" : "3"} de 3
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-400">Progresso</span>
          <span className="text-white">{points}/{maxPoints} XP</span>
        </div>
        <Progress value={progress} className="h-2 bg-furia-lightGray" indicatorClassName="bg-furia-red" />
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Irritado</span>
          {isIrritado && <Check className="h-5 w-5 text-green-500" />}
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Bravo</span>
          {isBravo && <Check className="h-5 w-5 text-green-500" />}
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Furioso</span>
          {isFurioso && <Check className="h-5 w-5 text-green-500" />}
        </div>
      </div>
    </div>
  );
}
