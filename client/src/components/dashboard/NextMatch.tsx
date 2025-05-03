import { useQuery } from "@tanstack/react-query";
import { Match } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader2 } from "lucide-react";

export function NextMatch() {
  const { data: matches, isLoading } = useQuery<Match[]>({
    queryKey: ["/api/matches", "next"],
    queryFn: async () => {
      const response = await fetch("/api/matches?limit=1");
      if (!response.ok) {
        throw new Error("Failed to fetch next match");
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="bg-black/50 rounded-lg p-6 mb-8">
        <h3 className="font-rajdhani font-bold text-2xl mb-6">Próximo Jogo</h3>
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-furia-red" />
        </div>
      </div>
    );
  }

  if (!matches || matches.length === 0) {
    return (
      <div className="bg-black/50 rounded-lg p-6 mb-8">
        <h3 className="font-rajdhani font-bold text-2xl mb-6">Próximo Jogo</h3>
        <p className="text-center text-gray-400">
          Nenhum jogo programado no momento.
        </p>
      </div>
    );
  }

  const nextMatch = matches[0];
  const matchDate = new Date(nextMatch.date);
  const formattedDate = format(matchDate, "dd 'de' MMMM • HH:mm", {
    locale: ptBR,
  });

  // Check if the match is today
  const isToday = new Date().toDateString() === matchDate.toDateString();
  const timeLabel = isToday
    ? "HOJE • " + format(matchDate, "HH:mm")
    : formattedDate;

  return (
    <div className="bg-black/50 rounded-lg p-6 mb-8">
      <h3 className="font-rajdhani font-bold text-2xl mb-6">Próximo Jogo</h3>

      <div className="bg-furia-darkBlue border border-furia-red/30 rounded-lg overflow-hidden p-6">
        <div className="flex justify-between items-center mb-6">
          <span className="text-accent-yellow font-rajdhani font-semibold">
            {nextMatch.game}
          </span>
          <span className="bg-furia-red/20 text-white text-sm px-3 py-1 rounded-full">
            {isToday ? "HOJE • " + format(matchDate, "HH:mm") : formattedDate}
          </span>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col items-center mb-4 md:mb-0">
            <svg className="h-24 md:h-32 mb-2 text-white" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="#b49a1c" />
              <text
                x="50"
                y="55"
                fontSize="20"
                fill="white"
                textAnchor="middle"
                className="font-rajdhani font-bold"
              >
                FURIA
              </text>
            </svg>
            <span className="font-rajdhani font-bold text-2xl md:text-3xl">
              {nextMatch.team1}
            </span>
          </div>
          <div className="text-center text-furia-red font-rajdhani font-bold text-4xl mb-4 md:mb-0">
            VS
          </div>
          <div className="flex flex-col items-center">
            <svg className="h-24 md:h-32 mb-2 text-white" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="#333" />
              <text
                x="50"
                y="55"
                fontSize="20"
                fill="white"
                textAnchor="middle"
                className="font-rajdhani font-bold"
              >
                {nextMatch.team2.substring(0, 4)}
              </text>
            </svg>
            <span className="font-rajdhani font-bold text-2xl md:text-3xl">
              {nextMatch.team2}
            </span>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p className="text-gray-300 text-lg mb-2">{nextMatch.tournament}</p>
          <p className="text-white text-lg font-semibold mb-4">
            {formattedDate}
          </p>
          <Button className="bg-furia-red text-white px-6 py-3 rounded font-rajdhani font-bold hover:bg-red-700 transition-colors">
            <i className="ri-notification-line mr-2"></i> ADICIONAR LEMBRETE
          </Button>
        </div>
      </div>
    </div>
  );
}
