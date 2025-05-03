import { SetStateAction, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader2 } from "lucide-react";
import {
  BarChart,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";

type Match = {
  id: number;
  game: string;
  team1: string;
  team1_score: number;
  team2: string;
  team2_score: number;
  tournament: string;
  date: string;
};

function getRandomRating(): number {
  // Função para gerar uma avaliação aleatória entre 1 e 5
  return Math.floor(Math.random() * 5) + 1;
}

export function MatchHistory() {
  const [ratingHistory, setRatingHistory] = useState<any[]>([]); // Histórico de avaliações da partida
  const [playerRatingsHistory, setPlayerRatingsHistory] = useState<any[]>([]); // Histórico de avaliações dos jogadores

  const match = {
    team1Players: ["Jogador1", "Jogador2", "Jogador3"],
    team2Players: ["Jogador4", "Jogador5", "Jogador6"],
  };

  useEffect(() => {
    const generatedRatings = [];
    const playerGeneratedRatings: SetStateAction<any[]> = [];

    // Simulando 20 avaliações com intervalo de 5 minutos
    let timeStamp = new Date();
    for (let i = 0; i < 20; i++) {
      const averageRating = getRandomRating();

      // Gerando avaliação para o jogo
      generatedRatings.push({
        timestamp: new Date(timeStamp.getTime() + i * 5 * 60 * 1000),
        average: averageRating,
        time: format(
          new Date(timeStamp.getTime() + i * 5 * 60 * 1000),
          "HH:mm"
        ), // <-- Adiciona o campo "time"
      });

      // Gerando avaliação para os jogadores do time 1
      match.team1Players.forEach((player) => {
        playerGeneratedRatings.push({
          playerName: player,
          rating: getRandomRating(),
          timestamp: new Date(timeStamp.getTime() + i * 5 * 60 * 1000),
        });
      });
    }

    // Atualizando o estado com os dados gerados
    setRatingHistory(generatedRatings);
    setPlayerRatingsHistory(playerGeneratedRatings);
  }, []);

  return (
    <div className="bg-black/50 rounded-lg p-6 mb-8">
      <h3 className="font-rajdhani font-bold text-2xl mb-6">
        Histórico de Jogos
      </h3>
      {/* const matchDate = new Date(match.date);
        const formattedDate = format(matchDate, "dd 'de' MMMM • HH:mm", { locale: ptBR }); */}
      <div className="bg-furia-darkBlue border border-furia-red/30 rounded-lg overflow-hidden p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <span className="text-accent-yellow font-rajdhani font-semibold">
            VALORANT
          </span>
          <span className="text-white text-sm">04 de maio • 20:33</span>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Time 1 */}
          <div className="flex flex-col items-center mb-4 md:mb-0">
            <svg className="h-24 md:h-32 mb-2 text-white" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill={10 > 8 ? "#b49a1c" : "#333"}
              />
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
              FURIA
            </span>
          </div>

          {/* VS + placares */}
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <span className="font-rajdhani font-bold text-3xl">{10}</span>
            <span className="text-center text-furia-red font-rajdhani font-bold text-4xl">
              VS
            </span>
            <span className="font-rajdhani font-bold text-3xl">{8}</span>
          </div>

          {/* Time 2 */}
          <div className="flex flex-col items-center">
            <svg className="h-24 md:h-32 mb-2 text-white" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill={10 > 8 ? "#333" : "#b49a1c"}
              />
              <text
                x="50"
                y="55"
                fontSize="20"
                fill="white"
                textAnchor="middle"
                className="font-rajdhani font-bold"
              >
                {`LOUD`.substring(0, 4)}
              </text>
            </svg>
            <span className="font-rajdhani font-bold text-2xl md:text-3xl">
              LOUD
            </span>
          </div>
        </div>
        <span className="block text-center my-2">
          Avaliação média da partida
        </span>

        {/* Gráfico do histórico do jogo */}
        <div className="h-[200px] w-full max-w-4xl mx-auto">
          {ratingHistory.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratingHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />{" "}
                {/* Certifique-se que 'time' existe nos dados */}
                <YAxis domain={[0, 5]} hide />
                <Tooltip />
                <Bar dataKey="average" fill="#b39d2e" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Sem dados de histórico disponíveis
            </div>
          )}
        </div>

        {/* Histórico de avaliações dos jogadores */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {match.team1Players
            ?.concat(match.team2Players ?? [])
            .map((player, index) => {
              const playerData = playerRatingsHistory
                .filter((r) => r.playerName === player)
                .map((r) => ({
                  time: format(new Date(r.timestamp), "HH:mm"),
                  rating: r.rating,
                }));

              if (playerData.length === 0) return null;

              return (
                <div key={index} className="h-[150px] w-full">
                  <div className="text-sm font-semibold text-center mb-1">
                    {player}
                  </div>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={playerData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis domain={[0, 5]} hide />
                      <Tooltip />
                      <Bar dataKey="rating" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              );
            })}
        </div>
      </div>
      {/*  <div key={match.id} className="bg-furia-darkBlue border border-furia-red/30 rounded-lg overflow-hidden p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-accent-yellow font-rajdhani font-semibold">{match.game}</span>
              <span className="text-white text-sm">{formattedDate}</span>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex flex-col items-center mb-4 md:mb-0">
                <svg className="h-24 md:h-32 mb-2 text-white" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill={match.team1_score > match.team2_score ? "#b49a1c" : "#333"} />
                  <text x="50" y="55" fontSize="20" fill="white" textAnchor="middle" className="font-rajdhani font-bold">FURIA</text>
                </svg>
                <span className="font-rajdhani font-bold text-2xl md:text-3xl">{match.team1}</span>
                <span className="font-rajdhani font-semibold text-lg">{match.team1_score}</span>
              </div>
              <div className="text-center text-furia-red font-rajdhani font-bold text-4xl mb-4 md:mb-0">VS</div>
              <div className="flex flex-col items-center">
                <svg className="h-24 md:h-32 mb-2 text-white" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill={match.team2_score > match.team1_score ? "#333" : "#b49a1c"} />
                  <text x="50" y="55" fontSize="20" fill="white" textAnchor="middle" className="font-rajdhani font-bold">
                    {match.team2.substring(0, 4)}
                  </text>
                </svg>
                <span className="font-rajdhani font-bold text-2xl md:text-3xl">{match.team2}</span>
                <span className="font-rajdhani font-semibold text-lg">{match.team2_score}</span>
              </div>
            </div>
            <div className="mt-8 text-center">
              <p className="text-gray-300 text-lg mb-2">{match.tournament}</p>
              <p className="text-white text-lg font-semibold mb-4">
                {match.team1_score > match.team2_score
                  ? `${match.team1} Vencedor`
                  : match.team1_score < match.team2_score
                  ? `${match.team2} Vencedor`
                  : "Empate"}
              </p>
              <Button
                onClick={() => alert(`Assistir Repetição de ${match.game}`)}
                className="bg-furia-red text-white px-6 py-3 rounded font-rajdhani font-bold hover:bg-red-700 transition-colors"
              >
                <i className="ri-live-line mr-2"></i> VER REPETIÇÃO
              </Button>
            </div>
          </div> */}
    </div>
  );
}
