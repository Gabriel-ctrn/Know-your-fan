import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLiveMatch, WebSocketResponse } from "@/hooks/use-live-match";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Rating } from "@/components/ui/rating";
import { WsConnectStatus } from "@/components/ui/ws-connect-status";
import { Loader2, TrendingUp, Users, Star } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import logo1 from "../../images/logo.webp"
import logo2 from "../../images/image.png";

export function LiveMatch() {
  const { user } = useAuth();
  const {
    match,
    socket,
    matchRatings,
    playerRatings,
    averageRating,
    lastUpdate,
    ratingHistory,
    handleSocketConnect,
    handleWebSocketMessage,
  } = useLiveMatch();

  const [selectedTab, setSelectedTab] = useState("partida");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [playerRating, setPlayerRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [localRatingHistory, setLocalRatingHistory] = useState(ratingHistory);

  const [playerRatingsHistory, setPlayerRatingsHistory] = useState<any[]>([]);

  const selectedRatingRef = useRef<number | null>(null);
  const [playerRatingsMap, setPlayerRatingsMap] = useState<
    Record<string, number>
  >({});

  // Format date for display
  const formatMatchTime = (date: Date) => {
    return format(new Date(date), "HH:mm", { locale: ptBR });
  };


  // Prepare chart data
  const chartData = localRatingHistory.map((item) => ({
    time: format(new Date(item.timestamp), "HH:mm"),
    rating: item.average,
  }));

  // Format player ratings for display
  const getPlayerAverageRating = (playerName: string) => {
    const ratings = playerRatings.filter((r) => r.playerName === playerName);
    if (ratings.length === 0) return 0;

    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    return sum / ratings.length;
  };

  useEffect(() => {
    console.log("ratingHistory:", ratingHistory);
  }, [ratingHistory]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Atualizar histórico de avaliações da partida
      if (selectedRating !== null) {
        const newEntry = {
          timestamp: new Date(),
          average: selectedRating,
        };
        setLocalRatingHistory((prev) => [...prev, newEntry]);
      }

      // Atualizar histórico de avaliações dos jogadores
      Object.entries(playerRatingsMap).forEach(([playerName, rating]) => {
        if (rating !== null) {
          const newPlayerRating = {
            playerName,
            rating,
            timestamp: new Date(),
          };
          setPlayerRatingsHistory((prev) => [...prev, newPlayerRating]);
        }
      });
    }, 5000); // Atualiza a cada 5 segundos

    return () => clearInterval(interval); // Limpeza ao desmontar
  }, [selectedRating, playerRatingsMap]);

  if (!match) {
    return (
      <Card className="w-full bg-card shadow-md">
        <CardHeader>
          <CardTitle>Partida ao Vivo</CardTitle>
          <CardDescription>Nenhuma partida ao vivo no momento</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-card shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Partida ao Vivo</CardTitle>
          <Badge variant="destructive" className="animate-pulse">
            AO VIVO
          </Badge>
        </div>
        <CardDescription>
          <div className="flex justify-between items-center">
            <div>{match.tournament}</div>
            <div>
              {isConnected ? (
                <Badge variant="outline" className="text-green-500">
                  Conectado
                </Badge>
              ) : (
                <Badge variant="outline" className="text-yellow-500">
                  Reconectando...
                </Badge>
              )}
            </div>
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col items-center w-1/3">
            <img
              src={logo1}
              alt={match.team1}
              className="w-20 h-20 object-contain"
            />
            <div className="font-bold text-lg">{match.team1}</div>
          </div>

          <div className="text-center">
            <div className="text-4xl font-bold text-primary">VS</div>
            <div className="text-sm text-muted-foreground">
              {match.date && formatMatchTime(match.date)}
            </div>
          </div>

          <div className="flex flex-col items-center w-1/3">
            <img
              src={logo2}
              alt={match.team2}
              className="w-20 h-20 object-contain"
            />
            <div className="font-bold text-lg">{match.team2}</div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-2 my-6">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm text-muted-foreground">
              Avaliação média da partida
            </div>
          </div>

          <Rating
            value={selectedRating ?? 0}
            onValueChange={setSelectedRating}
            count={5}
            className="text-yellow-500 [&_svg]:w-10 [&_svg]:h-10"
          />
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="partida">Partida</TabsTrigger>
            <TabsTrigger value="jogadores">Jogadores</TabsTrigger>
            <TabsTrigger value="historico">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="partida" className="space-y-4">
            <div className="rounded-md bg-muted p-4">
              <h4 className="font-medium mb-2">Detalhes da Partida</h4>
              <div className="text-sm text-muted-foreground">
                <p>
                  <strong>Jogo:</strong> {match.game}
                </p>
                <p>
                  <strong>Torneio:</strong> {match.tournament}
                </p>
                <p>
                  <strong>Total de avaliações:</strong> {matchRatings.length}
                </p>
                {lastUpdate && (
                  <p>
                    <strong>Última atualização:</strong>{" "}
                    {format(new Date(lastUpdate), "HH:mm:ss")}
                  </p>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="jogadores" className="space-y-4">
            <div className="h-full flex items-center justify-center">
              <div>
                <div className="space-y-2">
                  {match.team1Players?.map((player, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-4 py-2"
                    >
                      <div className="text-sm font-medium">{player}</div>
                      <div className="flex items-center gap-4 ml-8">
                        <Rating
                          value={
                            playerRatingsMap[player] ??
                            getPlayerAverageRating(player)
                          }
                          onValueChange={(value) => {
                            setPlayerRatingsMap((prev) => ({
                              ...prev,
                              [player]: value,
                            }));
                          }}
                          count={5}
                          className="[&_svg]:w-5 [&_svg]:h-5 text-yellow-500"
                        />
                      </div>
                    </div>
                  ))}

                  {!match.team1Players?.length && (
                    <div className="text-sm text-muted-foreground">
                      Nenhum jogador disponível
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="historico">
            <div className="h-[200px] w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Bar dataKey="rating" fill="#b49a1c" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Sem dados de histórico disponíveis
                </div>
              )}
            </div>

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
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter>
        <div className="text-xs text-muted-foreground">
          As avaliações são atualizadas automaticamente a cada minuto.
        </div>
      </CardFooter>
    </Card>
  );
}
