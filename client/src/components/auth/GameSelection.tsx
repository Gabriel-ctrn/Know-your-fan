import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface GameSelectionProps {
  selectedGame: string;
  setSelectedGame: (game: string) => void;
  termsAccepted: boolean;
  setTermsAccepted: (accepted: boolean) => void;
  onBack: () => void;
  onNext: () => void;
  isPending: boolean;
}

export function GameSelection({
  selectedGame,
  setSelectedGame,
  termsAccepted,
  setTermsAccepted,
  onBack,
  onNext,
  isPending
}: GameSelectionProps) {
  const games = [
    {
      id: "cs2",
      name: "CS2",
      image: "https://images.unsplash.com/photo-1624089753324-a74aecc6843b?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=300&q=80"
    },
    {
      id: "valorant",
      name: "VALORANT",
      image: "https://images.unsplash.com/photo-1591115765373-5207764f72e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=300&q=80"
    },
    {
      id: "lol",
      name: "LOL",
      image: "https://images.unsplash.com/photo-1542751371-6533d14d705f?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=300&q=80"
    }
  ];

  const handleGameSelect = (gameId: string) => {
    setSelectedGame(gameId);
  };

  return (
    <div id="step4">
      <p className="text-gray-400 text-sm mb-6">Qual é o seu jogo favorito? Isso nos ajudará a personalizar sua experiência.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {games.map((game) => (
          <div
            key={game.id}
            className={`game-item relative overflow-hidden rounded-lg cursor-pointer transform transition-all duration-300 ${
              selectedGame === game.id ? "ring-2 ring-furia-red" : ""
            }`}
            onClick={() => handleGameSelect(game.id)}
          >
            <div 
              className="w-full h-48 bg-cover bg-center"
              style={{ backgroundImage: `url(${game.image})` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="font-rajdhani font-bold text-xl text-white">{game.name}</h3>
            </div>
            <div 
              className={`game-overlay absolute inset-0 bg-furia-red flex items-center justify-center transition-opacity duration-300 ${
                selectedGame === game.id ? "opacity-80" : "opacity-0"
              }`}
            >
              <span className="font-rajdhani font-bold text-white text-xl">SELECIONADO</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mb-6">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="termsCheck"
            checked={termsAccepted}
            onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
            className="data-[state=checked]:bg-furia-red data-[state=checked]:border-furia-red"
          />
          <Label
            htmlFor="termsCheck"
            className="text-gray-300 text-sm"
          >
            Li e concordo com os <a href="#" className="text-furia-red hover:underline">Termos de Uso</a> e <a href="#" className="text-furia-red hover:underline">Política de Privacidade</a>
          </Label>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button
          type="button"
          onClick={onBack}
          disabled={isPending}
          variant="outline"
          className="bg-transparent border border-gray-700 text-white px-6 py-2 rounded hover:bg-furia-lightGray transition-colors"
        >
          Voltar
        </Button>
        <Button
          type="button"
          onClick={onNext}
          disabled={!selectedGame || !termsAccepted || isPending}
          className="bg-furia-red text-white px-6 py-2 rounded font-rajdhani font-bold hover:bg-red-700 transition-colors"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando...
            </>
          ) : (
            "Finalizar Cadastro"
          )}
        </Button>
      </div>
    </div>
  );
}
