import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";

export default function AuthPage() {
  const [showRegister, setShowRegister] = useState(false);
  const { user } = useAuth();
  
  // Redirect to dashboard if user is already logged in
  if (user) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-furia-darkBlue">
      <Navbar />
      
      <main className="flex-grow pt-16">
        <section className="min-h-screen py-16 px-4">
          {showRegister ? (
            <RegisterForm onShowLogin={() => setShowRegister(false)} />
          ) : (
            <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-8">
              <div className="w-full md:w-1/2">
                <LoginForm onShowRegister={() => setShowRegister(true)} />
              </div>
              
              <div className="w-full md:w-1/2 max-w-md p-8 bg-black/50 rounded-lg border border-furia-red/30 shadow-lg">
                <div className="text-center mb-6">
                  <h2 className="font-rajdhani font-bold text-3xl text-white">JUNTE-SE À FURIA</h2>
                  <p className="text-gray-300 mt-2">Tenha acesso a conteúdo exclusivo e faça parte da comunidade FURIA</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-furia-red rounded-full p-2 mt-1">
                      <i className="ri-gamepad-line text-white text-lg"></i>
                    </div>
                    <div>
                      <h3 className="font-rajdhani font-bold text-xl text-white">Acompanhe seus Times</h3>
                      <p className="text-gray-400 text-sm">Fique por dentro de todos os jogos e resultados dos times da FURIA</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-furia-red rounded-full p-2 mt-1">
                      <i className="ri-newspaper-line text-white text-lg"></i>
                    </div>
                    <div>
                      <h3 className="font-rajdhani font-bold text-xl text-white">Notícias Exclusivas</h3>
                      <p className="text-gray-400 text-sm">Acesse em primeira mão as notícias e atualizações sobre a FURIA</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-furia-red rounded-full p-2 mt-1">
                      <i className="ri-vip-crown-line text-white text-lg"></i>
                    </div>
                    <div>
                      <h3 className="font-rajdhani font-bold text-xl text-white">Conteúdo Premium</h3>
                      <p className="text-gray-400 text-sm">Desfrute de conteúdos exclusivos e interaja com a comunidade</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <button 
                    onClick={() => setShowRegister(true)}
                    className="w-full bg-furia-red text-white py-3 rounded font-rajdhani font-bold hover:bg-red-700 transition-colors"
                  >
                    CRIAR CONTA AGORA
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
