import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginUserSchema } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Redirect, useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

// Extend the schema with additional validations
const formSchema = loginUserSchema.extend({
  rememberMe: z.boolean().optional()
});

type LoginFormValues = z.infer<typeof formSchema>;

interface LoginFormProps {
  onShowRegister: () => void;
}

export function LoginForm({ onShowRegister }: LoginFormProps) {
  const { loginMutation, user } = useAuth();
  const [, navigate] = useLocation();

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Redirect to="/dashboard" />;
  }

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false
    }
  });

  const onSubmit = async (values: LoginFormValues) => {
    await loginMutation.mutateAsync({
      email: values.email,
      password: values.password
    });
  };

  return (
    <div className="auth-container w-full max-w-md p-8 rounded-lg border border-furia-red/30 shadow-lg">
      <div className="text-center mb-8">
        <svg className="h-16 mx-auto mb-4 text-white" viewBox="0 0 100 100">
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
        <h2 className="font-rajdhani font-bold text-2xl text-white">
          Login FURIA
        </h2>
        <p className="text-gray-400 text-sm mt-2">
          Entre na sua conta para acessar o conteúdo exclusivo
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="seu@email.com"
                    className="w-full bg-furia-lightGray text-white border border-gray-700 rounded px-4 py-2 focus:outline-none focus:border-furia-red"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Senha</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="********"
                    className="w-full bg-furia-lightGray text-white border border-gray-700 rounded px-4 py-2 focus:outline-none focus:border-furia-red"
                  />
                </FormControl>
                <div className="flex justify-end mt-1">
                  <a
                    href="#"
                    className="text-furia-red text-xs hover:underline"
                  >
                    Esqueceu a senha?
                  </a>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-furia-red data-[state=checked]:border-furia-red"
                  />
                </FormControl>
                <FormLabel className="text-gray-300 text-sm">
                  Manter conectado
                </FormLabel>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-furia-red text-white py-3 rounded font-rajdhani font-bold hover:bg-red-700 transition-colors"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> ENTRANDO...
              </>
            ) : (
              "ENTRAR"
            )}
          </Button>

          <div className="text-center mt-4">
            <p className="text-gray-400 text-sm">
              Ainda não tem uma conta?
              <button
                type="button"
                onClick={onShowRegister}
                className="text-furia-red hover:underline ml-1"
              >
                Cadastre-se
              </button>
            </p>
          </div>

          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-700"></div>
            <div className="px-4 text-gray-500 text-sm">ou continue com</div>
            <div className="flex-grow h-px bg-gray-700"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className="flex items-center justify-center bg-transparent border border-gray-700 text-white py-2 rounded hover:bg-furia-lightGray transition-colors"
            >
              <i className="ri-google-fill mr-2"></i> Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center bg-transparent border border-gray-700 text-white py-2 rounded hover:bg-furia-lightGray transition-colors"
            >
              <i className="ri-discord-fill mr-2"></i> Discord
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
}
