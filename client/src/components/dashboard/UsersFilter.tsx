import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

type User = {
  id: number;
  name: string;
  avatarUrl: string;
};

export function UserList() {
  const [search, setSearch] = useState("");
  const [, navigate] = useLocation();

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
    <div className="bg-black/50 rounded-lg p-6 mb-8">
      <h3 className="font-rajdhani font-bold text-2xl mb-6">Usuários</h3>
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
              onClick={() => navigate(`/usuarios/${user.id}`)}
              className="bg-furia-red text-white w-full"
            >
              <i className="ri-user-line mr-2"></i> Ver Perfil
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
