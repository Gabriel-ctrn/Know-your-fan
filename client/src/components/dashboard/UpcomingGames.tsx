import { useQuery } from "@tanstack/react-query";
import { Match } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function UpcomingGames() {
  const { data: matches, isLoading } = useQuery<Match[]>({
    queryKey: ["/api/matches"],
  });

  if (isLoading) {
    return (
      <div className="bg-black/50 rounded-lg p-6 mb-8">
        <h3 className="font-rajdhani font-bold text-xl mb-4">Próximos Jogos</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="border-b border-gray-800 pb-4 last:border-b-0"
            >
              <div className="flex flex-col space-y-2">
                <Skeleton className="h-4 w-24 bg-gray-700" />
                <Skeleton className="h-6 w-full bg-gray-700" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!matches || matches.length === 0) {
    return (
      <div className="bg-black/50 rounded-lg p-6 mb-8">
        <h3 className="font-rajdhani font-bold text-xl mb-4">Próximos Jogos</h3>
        <p className="text-gray-400 text-sm">
          Nenhum jogo agendado no momento.
        </p>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return format(new Date(date), "dd/MM", { locale: ptBR });
  };

  return (
    <div className="bg-black/50 rounded-lg p-6 mb-8">
      <h3 className="font-rajdhani font-bold text-xl mb-4">Próximos Jogos</h3>

      <div className="space-y-4">
        {matches.slice(0, 3).map((match) => (
          <div
            key={match.id}
            className="border-b border-gray-800 pb-4 last:border-b-0"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-accent-yellow font-rajdhani font-semibold text-sm">
                {match.game}
              </span>
              <span className="text-gray-400 text-xs">
                {formatDate(match.date)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <svg className="h-6 mr-1 text-white" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="#b49a1c" />
                  <text
                    x="50"
                    y="52"
                    fontSize="10"
                    fill="white"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="font-rajdhani font-bold"
                  >
                    FURIA
                  </text>
                </svg>
                <span className="font-rajdhani font-semibold text-sm">
                  {match.team1}
                </span>
              </div>
              <div className="text-center text-furia-red font-rajdhani font-bold text-sm">
                VS
              </div>
              <div className="flex items-center">
                <span className="font-rajdhani font-semibold text-sm">
                  {match.team2}
                </span>
                <svg className="h-6 ml-1 text-white" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="#333" />
                  <text
                    x="50"
                    y="52"
                    fontSize="10"
                    fill="white"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="font-rajdhani font-bold"
                  >
                    {match.team2.substring(0, 4)}
                  </text>
                </svg>
              </div>
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          className="w-full bg-transparent border border-furia-red text-white py-2 rounded text-sm hover:bg-furia-red/20 transition-colors"
        >
          Ver Todos os Jogos
        </Button>
      </div>
    </div>
  );
}
