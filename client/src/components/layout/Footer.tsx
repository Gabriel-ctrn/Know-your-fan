import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-black border-t border-furia-red/30 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <svg className="h-10 mr-2 text-white" viewBox="0 0 100 100">
                <path fill="#b49a1c" d="M10,10 L90,10 L90,90 L10,90 Z" />
                <path fill="white" d="M30,30 L70,30 L70,70 L30,70 Z" />
                <text
                  x="50"
                  y="60"
                  fontSize="24"
                  fill="#b49a1c"
                  textAnchor="middle"
                  className="font-rajdhani font-bold"
                >
                  FURIA
                </text>
              </svg>
              <span className="font-rajdhani font-bold text-xl text-white tracking-wider">
                FURIA
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              FURIA Esports é uma organização brasileira de esportes eletrônicos
              fundada em 2017, que compete em diversos jogos como CS2, Valorant,
              League of Legends e outros.
            </p>
          </div>

          <div>
            <h4 className="font-rajdhani font-bold text-lg text-white mb-4">
              Links Rápidos
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/">
                  <a className="text-gray-400 hover:text-furia-red transition-colors">
                    Início
                  </a>
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-furia-red transition-colors"
                >
                  Times
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-furia-red transition-colors"
                >
                  Campeonatos
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-furia-red transition-colors"
                >
                  Notícias
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-furia-red transition-colors"
                >
                  Loja
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-rajdhani font-bold text-lg text-white mb-4">
              Jogos
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-furia-red transition-colors"
                >
                  Counter-Strike 2
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-furia-red transition-colors"
                >
                  Valorant
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-furia-red transition-colors"
                >
                  League of Legends
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-furia-red transition-colors"
                >
                  Apex Legends
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-furia-red transition-colors"
                >
                  Free Fire
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-rajdhani font-bold text-lg text-white mb-4">
              Redes Sociais
            </h4>
            <div className="flex space-x-4 mb-4">
              <a
                href="#"
                className="text-gray-400 hover:text-furia-red transition-colors text-2xl"
              >
                <i className="ri-x-fill"></i>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-furia-red transition-colors text-2xl"
              >
                <i className="ri-instagram-fill"></i>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-furia-red transition-colors text-2xl"
              >
                <i className="ri-youtube-fill"></i>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-furia-red transition-colors text-2xl"
              >
                <i className="ri-twitch-fill"></i>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-furia-red transition-colors text-2xl"
              >
                <i className="ri-discord-fill"></i>
              </a>
            </div>
            <div>
              <h4 className="font-rajdhani font-bold text-lg text-white mb-2">
                Contato
              </h4>
              <p className="text-gray-400 text-sm">contato@furia.gg</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © 2024 FURIA Esports. Todos os direitos reservados.
          </p>
          <div className="flex space-x-4 text-sm">
            <a
              href="#"
              className="text-gray-400 hover:text-furia-red transition-colors"
            >
              Termos de Uso
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-furia-red transition-colors"
            >
              Política de Privacidade
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-furia-red transition-colors"
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
