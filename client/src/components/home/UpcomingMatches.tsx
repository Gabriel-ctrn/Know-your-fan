import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Match } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function UpcomingMatches() {
  const { data: matches, isLoading } = useQuery<Match[]>({
    queryKey: ["/api/matches"],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h2 className="font-rajdhani font-bold text-3xl mb-8 text-center">
          PRÓXIMOS JOGOS
        </h2>

          <div className="flex flex-wrap justify-center gap-6">
            {[1, 2].map((i) => (
              <Card
                key={i}
                className="bg-black border border-furia-red/30 rounded-lg p-6 max-w-sm w-full animate-pulse"
              >
                <div className="h-32"></div>
              </Card>
            ))}
          </div>
        </div>
    );
  }

  const formatMatchDate = (date: Date) => {
    return format(new Date(date), "dd 'de' MMMM • HH:mm", { locale: ptBR });
  };

  const formatTimeRemaining = (date: Date) => {
    const now = new Date();
    const matchDate = new Date(date);
    const diffDays = Math.ceil(
      (matchDate.getTime() - now.getTime()) / (1000 * 3600 * 24)
    );

    if (diffDays === 0) {
      return "HOJE";
    } else if (diffDays === 1) {
      return "AMANHÃ";
    } else if (diffDays <= 7) {
      return `${diffDays} dias`;
    } else {
      return `${Math.ceil(diffDays / 7)} semanas`;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="font-rajdhani font-bold text-3xl mb-8 text-center">
        PRÓXIMOS JOGOS
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 place-items-center">
        {matches?.map((match) => (
          <div
            key={match.id}
            className="bg-black border border-furia-red/30 rounded-lg overflow-hidden hover:border-furia-red transition-all duration-300 group w-full max-w-sm"
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-accent-yellow font-rajdhani font-semibold">
                  {match.game}
                </span>
                <span className="bg-furia-red/20 text-white text-sm px-3 py-1 rounded-full">
                  {formatTimeRemaining(match.date)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <svg className="h-12 mr-2 text-white" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="#b49a1c" />
                    <text
                      x="50"
                      y="50"
                      fontSize="14"
                      fill="white"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="font-rajdhani font-bold"
                    >
                      FURIA
                    </text>
                  </svg>
                  <span className="font-rajdhani font-bold text-lg">
                    {match.team1}
                  </span>
                </div>
                <div className="text-center text-furia-red font-rajdhani font-bold text-xl">
                  VS
                </div>
                <div className="flex items-center">
                  <span className="font-rajdhani font-bold text-lg">
                    {match.team2}
                  </span>
                  <svg className="h-12 ml-2 text-white" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="#333" />
                    <text
                      x="50"
                      y="50"
                      fontSize="14"
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
              <div className="mt-4 text-center">
                <p className="text-gray-400 text-sm">{match.tournament}</p>
                <p className="text-white text-sm mt-1">
                  {formatMatchDate(match.date)}
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full mt-4 bg-transparent border border-furia-red text-white py-2 rounded hover:bg-furia-red/20 transition-colors group-hover:bg-furia-red group-hover:text-white"
              >
                Lembrar
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
