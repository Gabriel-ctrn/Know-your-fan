import { Link } from "wouter";

export function HeroSection() {
  return (
    <div className="relative h-[60vh] md:h-[80vh] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-furia-darkBlue z-10"></div>
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80')"
        }}
      ></div>
      <div className="container mx-auto px-4 relative z-20 h-full flex flex-col justify-end pb-16">
        <h1 className="font-rajdhani font-bold text-4xl md:text-6xl text-white leading-tight mb-4">
          BEM-VINDO AO <span className="text-furia-red">FUTURO</span> DO <br/>E-SPORTS
        </h1>
        <p className="text-lg md:text-xl text-gray-200 max-w-2xl mb-8">
          Junte-se à comunidade FURIA e fique por dentro de todas as novidades, jogos e conquistas do seu time favorito.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link href="/auth">
            <a className="bg-furia-red font-rajdhani font-bold text-white px-8 py-3 rounded hover:bg-red-700 transition-all shadow-lg hover:shadow-red-500/30">
              COMEÇAR AGORA
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
