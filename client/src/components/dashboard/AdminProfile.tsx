import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { UserProfile } from "@/components/dashboard/UserProfile";
import { NextMatch } from "@/components/dashboard/NextMatch";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { MatchHistory } from "@/components/dashboard/MatchHistory";
import { useState } from "react";
import { navigate } from "wouter/use-browser-location";
import { Button } from "../ui/button";
import { UserDetails } from "./UserInformation";

type User = {
  id: number;
  name: string;
  avatarUrl: string;
};

export default function DashboardAdminPage() {
  const { user, isLoading } = useAuth();
  const [search, setSearch] = useState("");
  const [seeUser, setSeeUser] = useState<string | null>(null); // Alterei para string ou null

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-furia-darkBlue">
        <Navbar />
        <main className="flex-grow pt-16 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-furia-red" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const users: User[] = [
    {
      id: 1,
      name: "Lucas Silva",
      avatarUrl: "https://i.pravatar.cc/150?img=1",
    },
    {
      id: 2,
      name: "Maria Oliveira",
      avatarUrl: "https://i.pravatar.cc/150?img=2",
    },
    {
      id: 3,
      name: "Carlos Mendes",
      avatarUrl: "https://i.pravatar.cc/150?img=3",
    },
    {
      id: 4,
      name: "Juliana Costa",
      avatarUrl: "https://i.pravatar.cc/150?img=4",
    },
    {
      id: 5,
      name: "Fernanda Rocha",
      avatarUrl: "https://i.pravatar.cc/150?img=5",
    },
  ];

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-furia-darkBlue">
      <Navbar />

      <main className="flex-grow pt-16">
        <UserProfile />

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {seeUser ? (
                <UserDetails id={seeUser} /> // Corrigindo a sintaxe de passar a prop
              ) : (
                <>
                  <NextMatch />
                  <MatchHistory />

                  <div className="bg-black/50 rounded-lg p-6 mb-8">
                    <h3 className="font-rajdhani font-bold text-2xl mb-6">
                      Usuários
                    </h3>
                    <div className="mb-4">
                      <input
                        type="text"
                        placeholder="Filtrar por nome"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full p-2 rounded bg-gray-800 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {filteredUsers.map((user) => (
                        <div
                          key={user.id}
                          className="bg-furia-darkBlue border border-furia-red/30 rounded-lg p-4"
                        >
                          <div className="flex items-center mb-4">
                            <img
                              src={user.avatarUrl}
                              alt={user.name}
                              className="w-16 h-16 rounded-full mr-4"
                            />
                            <span className="text-white font-rajdhani font-bold text-xl">
                              {user.name}
                            </span>
                          </div>
                          <Button
                            onClick={() => {
                              // Alterei para setSeeUser ao invés de navegar
                              setSeeUser(user.id.toString());
                            }}
                            className="bg-furia-red text-white w-full"
                          >
                            <i className="ri-user-line mr-2"></i> Ver Perfil
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
