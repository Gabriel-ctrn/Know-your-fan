import {
  useState,
  useEffect,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
} from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { FaTwitter, FaInstagram, FaFacebook, FaGithub } from "react-icons/fa";

// Registrando os componentes do ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type UserDetailsProps = {
  id: string;
};

export function UserDetails({ id }: UserDetailsProps) {
  const [user, setUser] = useState<any>(null);

  const mockUsers = [
    {
      id: 1,
      name: "Lucas Silva",
      avatarUrl: "https://i.pravatar.cc/150?img=1",
      furiaLevel: "Raivoso",
      isAdmin: true,
      products: [
        { name: "Camiseta Oficial", rating: 4, comment: "Muito confortável!" },
        { name: "Moletom", rating: 5, comment: "Amei, super quente!" },
      ],
      socialMedia: [
        { platform: "Twitter", username: "@lucas_silva", icon: <FaTwitter /> },
        {
          platform: "Instagram",
          username: "@lucassilva",
          icon: <FaInstagram />,
        },
        { platform: "Facebook", username: "Lucas.Silva", icon: <FaFacebook /> },
        { platform: "GitHub", username: "lucassilva", icon: <FaGithub /> },
      ],
      score: -3, // pontuação entre -5 e 5
      commentsOverTime: [
        { day: "2023-04-01", comments: 5 },
        { day: "2023-04-02", comments: 3 },
        { day: "2023-04-03", comments: 4 },
      ],
      wordsUsed: ["furia", "camiseta", "vencedor", "fã", "moletom"],
    },
    {
      id: 2,
      name: "Maria Oliveira",
      avatarUrl: "https://i.pravatar.cc/150?img=2",
      furiaLevel: "Furioso",
      isAdmin: false,
      products: [
        { name: "Boné FURIA", rating: 2, comment: "Não gostei muito." },
      ],
      socialMedia: [
        {
          platform: "Twitter",
          username: "@maria_oliveira",
          icon: <FaTwitter />,
        },
        {
          platform: "Instagram",
          username: "@maria.oliveira",
          icon: <FaInstagram />,
        },
      ],
      score: -2, // pontuação entre -5 e 5
      commentsOverTime: [
        { day: "2023-04-01", comments: 2 },
        { day: "2023-04-02", comments: 1 },
      ],
      wordsUsed: ["furia", "boné", "desapontada"],
    },
  ];

  useEffect(() => {
    const foundUser = mockUsers.find((u) => u.id === Number(id));
    setUser(foundUser);
  }, [id]);

  if (!user) {
    return <div className="text-white">Usuário não encontrado.</div>;
  }

  // Preparar os dados para o gráfico de comentários
  const chartData = {
    labels: user.commentsOverTime.map((data: any) => data.day),
    datasets: [
      {
        label: "Comentários",
        data: user.commentsOverTime.map((data: any) => data.comments),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };


  return (
    <div className="bg-black/50 rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-rajdhani font-bold text-white mb-6">
        Informações do Usuário
      </h2>
      <div className="bg-furia-darkBlue border border-furia-red/30 rounded-lg p-6 mb-6">
        <div className="flex items-center space-x-4 mb-6">
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-50 h-50 rounded-full"
          />
          <div>
            <h3 className="text-white text-xl font-bold">{user.name}</h3>
            <p className="text-accent-yellow font-semibold">
              Nível FURIA: {user.furiaLevel}
            </p>
            {/* Indicador de Pontuação (Fã ↔ Hater) */}
            <div className="my-8">
              <h4 className="text-white text-lg font-bold mb-2">
                Classificação de Engajamento
              </h4>

              <div className="flex items-center justify-between text-white font-bold mb-2">
                <span
                  className={`transition-all duration-300 ${
                    user.score < 0
                      ? `text-${Math.min(Math.abs(user.score) + 2, 6)}xl`
                      : "text-sm"
                  } text-red-500`}
                >
                  Hater
                </span>

                <span
                  className={`transition-all duration-300 ${
                    user.score > 0 ? `text-${Math.min(user.score + 2, 6)}xl` : "text-sm"
                  } text-green-400`}
                >
                  Fã
                </span>
              </div>

              <div className="relative w-full h-4 bg-gray-700 rounded-full">
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full transition-all duration-300"
                  style={{ left: `${((user.score + 5) / 10) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {user.isAdmin && (
          <div>
            <h4 className="text-white text-lg font-semibold mb-2">
              Seus produtos FURIA
            </h4>
            {user.products.length > 0 ? (
              <ul className="list-disc pl-5 text-gray-300">
                {user.products.map(
                  (
                    product: { name: string; rating: number; comment: string },
                    index: Key | null | undefined
                  ) => (
                    <li key={index}>
                      <strong>{product.name}</strong> (Classificação:{" "}
                      {product.rating}/5) - <em>{product.comment}</em>
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p className="text-gray-400">Nenhum produto cadastrado.</p>
            )}
          </div>
        )}

        <div>
          <h4 className="text-white text-lg font-semibold mb-2">
            Redes Sociais
          </h4>
          <div className="flex space-x-6 mb-4">
            {user.socialMedia.length > 0 ? (
              user.socialMedia.map(
                (
                  social: {
                    platform: string;
                    username: string;
                    icon: ReactNode;
                  },
                  index: Key | null | undefined
                ) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 text-white"
                  >
                    {social.icon}
                    <span>{social.username}</span>
                  </div>
                )
              )
            ) : (
              <p className="text-gray-400">Nenhuma rede social vinculada.</p>
            )}
          </div>
        </div>

        <div className="my-8">
          <h4 className="text-white text-lg font-semibold mb-2">
            Comentários sobre o FURIA
          </h4>
          <Bar data={chartData} />
        </div>

        <div className="p-4 bg-gray-800 rounded-lg mt-6">
          <h4 className="text-white text-lg font-semibold mb-2">
            Palavras Mais Utilizadas
          </h4>
          <div className="flex flex-wrap gap-3">
            {user.wordsUsed.map(
              (
                word:
                  | string
                  | number
                  | boolean
                  | ReactElement<any, string | JSXElementConstructor<any>>
                  | Iterable<ReactNode>
                  | ReactPortal
                  | null
                  | undefined,
                index: Key | null | undefined
              ) => (
                <div
                  key={index}
                  className="bg-gray-600 text-white p-2 rounded-lg"
                >
                  {word}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
