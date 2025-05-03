import { useQuery } from "@tanstack/react-query";
import { News } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

export function NewsSection() {
  const { data: news, isLoading } = useQuery<News[]>({
    queryKey: ["/api/news"],
    queryFn: async () => {
      const response = await fetch("/api/news?limit=2");
      if (!response.ok) {
        throw new Error("Failed to fetch news");
      }
      return response.json();
    }
  });

  if (isLoading) {
    return (
      <div className="bg-black/50 rounded-lg p-6">
        <h3 className="font-rajdhani font-bold text-2xl mb-6">Últimas Notícias</h3>
        {[1, 2].map((i) => (
          <div key={i} className="border-b border-gray-800 py-4 last:border-b-0">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/3 mb-4 md:mb-0">
                <Skeleton className="h-48 w-full bg-gray-800 rounded" />
              </div>
              <div className="w-full md:w-2/3 md:pl-6">
                <Skeleton className="h-4 w-24 mb-2 bg-gray-800" />
                <Skeleton className="h-6 w-4/5 mb-2 bg-gray-800" />
                <Skeleton className="h-4 w-full mb-4 bg-gray-800" />
                <Skeleton className="h-4 w-20 bg-gray-800" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!news || news.length === 0) {
    return (
      <div className="bg-black/50 rounded-lg p-6">
        <h3 className="font-rajdhani font-bold text-2xl mb-6">Últimas Notícias</h3>
        <p className="text-center text-gray-400">Nenhuma notícia disponível no momento.</p>
      </div>
    );
  }

  const formatNewsDate = (date: Date) => {
    return format(new Date(date), "dd 'de' MMMM, yyyy", { locale: ptBR });
  };

  return (
    <div className="bg-black/50 rounded-lg p-6">
      <h3 className="font-rajdhani font-bold text-2xl mb-6">Últimas Notícias</h3>
      
      {news.map((item) => (
        <div key={item.id} className="border-b border-gray-800 py-4 last:border-b-0">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/3 mb-4 md:mb-0">
              <div className="h-48 rounded overflow-hidden">
                <div 
                  className="w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80')`
                  }}
                ></div>
              </div>
            </div>
            <div className="w-full md:w-2/3 md:pl-6">
              <div className="flex items-center mb-2">
                <span className="bg-furia-red/20 text-white text-xs px-2 py-1 rounded-full mr-2">{item.game}</span>
                <span className="text-gray-400 text-xs">{formatNewsDate(item.date)}</span>
              </div>
              <h4 className="font-rajdhani font-bold text-xl mb-2">{item.title}</h4>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">{item.content}</p>
              <Button variant="link" className="text-furia-red hover:underline font-semibold p-0">
                Ler mais
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
