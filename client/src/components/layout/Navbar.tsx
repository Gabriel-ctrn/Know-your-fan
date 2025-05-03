import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { SquareMenu, FileDiff } from "lucide-react";
import logo from "../../images/logo.webp";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
  };

  return (
    <nav className="bg-black fixed w-full top-0 z-50 py-2 px-4 shadow-md border-b border-furia-red/30">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <img
              src={logo}
              className="h-10 w-10 rounded"
            />
            <span className="font-rajdhani font-bold text-xl text-white tracking-wider">
              FURIA
            </span>
          </div>
        </Link>

        <div className="flex items-center">
          {user ? (
            <>
              <Link href="/dashboard">
                <a className="bg-transparent border border-furia-red text-white px-4 py-1 rounded mr-2 hover:bg-furia-red/20 transition-colors">
                  Meu Perfil
                </a>
              </Link>
              <button
                onClick={handleLogout}
                className="bg-furia-red text-white px-4 py-1 rounded hover:bg-red-700 transition-colors"
                disabled={logoutMutation.isPending}
              >
                {logoutMutation.isPending ? "Saindo..." : "Sair"}
              </button>
            </>
          ) : (
            <>
              <Link href="/auth">
                <a className="bg-transparent border border-furia-red text-white px-4 py-1 rounded mr-2 hover:bg-furia-red/20 transition-colors">
                  Entrar
                </a>
              </Link>
              <Link href="/auth">
                <a className="bg-furia-red text-white px-4 py-1 rounded hover:bg-red-700 transition-colors">
                  Cadastrar
                </a>
              </Link>
            </>
          )}
          <button className="md:hidden ml-4 text-white" onClick={toggleMenu}>
            {isMenuOpen ? (
              <FileDiff className="text-xl" />
            ) : (
              <SquareMenu className="text-xl" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/95 mt-2 p-4 rounded-b-lg">
          <div className="flex flex-col space-y-3">
            <Link href="/">
              <a
                className={`text-white hover:text-furia-red transition-colors ${
                  location === "/" ? "text-furia-red" : ""
                }`}
                onClick={closeMenu}
              >
                Início
              </a>
            </Link>
            <a
              href="#"
              className="text-white hover:text-furia-red transition-colors"
              onClick={closeMenu}
            >
              Times
            </a>
            <a
              href="#"
              className="text-white hover:text-furia-red transition-colors"
              onClick={closeMenu}
            >
              Jogos
            </a>
            <a
              href="#"
              className="text-white hover:text-furia-red transition-colors"
              onClick={closeMenu}
            >
              Notícias
            </a>
            <a
              href="#"
              className="text-white hover:text-furia-red transition-colors"
              onClick={closeMenu}
            >
              Loja
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
