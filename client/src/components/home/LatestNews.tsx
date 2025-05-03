import { useQuery } from "@tanstack/react-query";
import { News } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function LatestNews() {
  const { data: news, isLoading } = useQuery<News[]>({
    queryKey: ["/api/news"],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h2 className="font-rajdhani font-bold text-3xl mb-8 text-center">
          ÚLTIMAS NOTÍCIAS
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-black rounded-lg p-6 animate-pulse">
              <div className="h-48 bg-gray-800 mb-4 rounded"></div>
              <div className="h-6 bg-gray-800 mb-2 rounded w-3/4"></div>
              <div className="h-4 bg-gray-800 rounded w-full"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const formatNewsDate = (date: Date) => {
    return format(new Date(date), "dd 'de' MMMM, yyyy", { locale: ptBR });
  };

  return (
    <div className="mt-16">
      <h2 className="font-rajdhani font-bold text-3xl mb-8 text-center">
        ÚLTIMAS NOTÍCIAS
      </h2>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news?.map((item) => (
            <div
              key={item.id}
              className="bg-black rounded-lg overflow-hidden group cursor-pointer"
            >
              <div className="relative h-48 overflow-hidden">
                <div
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
                <div className="absolute top-0 left-0 bg-furia-red px-3 py-1 font-rajdhani font-semibold text-sm text-white">
                  {item.game}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-rajdhani font-bold text-xl mb-2 group-hover:text-furia-red transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {item.content}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-xs">
                    {formatNewsDate(item.date)}
                  </span>
                  <button className="text-furia-red hover:underline font-semibold">
                    Ler mais
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-8 mb-4">
        <Button
          variant="outline"
          className="bg-transparent border border-furia-red text-white px-6 py-2 rounded hover:bg-furia-red/20 transition-colors"
        >
          Ver mais notícias
        </Button>
      </div>
    </div>
  );
}
