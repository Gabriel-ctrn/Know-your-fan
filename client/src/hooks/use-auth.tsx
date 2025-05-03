import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { InsertUser, LoginUser, User } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<Omit<User, "password">, Error, LoginUser>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<Omit<User, "password">, Error, InsertUser>;
  verifyIdentityMutation: UseMutationResult<Omit<User, "password">, Error, { frontIdUrl: string; backIdUrl: string }>;
  verifyFaceMutation: UseMutationResult<Omit<User, "password">, Error, void>;
  selectGameMutation: UseMutationResult<Omit<User, "password">, Error, { favoriteGame: string }>;
  updateSocialMutation: UseMutationResult<Omit<User, "password">, Error, { facebook?: string; x?: string; discord?: string; twitch?: string; instagram?: string }>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<User | null>({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginUser) => {
      const res = await apiRequest("POST", "/api/login", credentials);
      return await res.json();
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo de volta, ${user.username}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Falha no login",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: InsertUser) => {
      const res = await apiRequest("POST", "/api/register", userData);
      return await res.json();
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Cadastro realizado com sucesso",
        description: "Sua conta foi criada com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Falha no cadastro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      toast({
        title: "Logout realizado com sucesso",
        description: "Você foi desconectado com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Falha no logout",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const verifyIdentityMutation = useMutation({
    mutationFn: async (idData: { frontIdUrl: string; backIdUrl: string }) => {
      const res = await apiRequest("POST", "/api/verify-identity", idData);
      return await res.json();
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Documentos enviados com sucesso",
        description: "Seus documentos foram recebidos e estão sendo verificados.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Falha no envio dos documentos",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const verifyFaceMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/verify-face", {});
      return await res.json();
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Verificação facial concluída",
        description: "Sua identidade foi verificada com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Falha na verificação facial",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const selectGameMutation = useMutation({
    mutationFn: async (gameData: { favoriteGame: string }) => {
      const res = await apiRequest("POST", "/api/select-game", gameData);
      return await res.json();
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Jogo favorito selecionado",
        description: `Você selecionou ${user.favoriteGame} como seu jogo favorito.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Falha ao selecionar jogo favorito",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const updateSocialMutation = useMutation({
    mutationFn: async (socialData: { facebook?: string; x?: string; discord?: string; twitch?: string; instagram?: string }) => {
      const res = await apiRequest("POST", "/api/update-social", socialData);
      return await res.json();
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Redes sociais atualizadas",
        description: "Suas redes sociais foram vinculadas com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Falha ao atualizar redes sociais",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
        verifyIdentityMutation,
        verifyFaceMutation,
        selectGameMutation,
        updateSocialMutation
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
