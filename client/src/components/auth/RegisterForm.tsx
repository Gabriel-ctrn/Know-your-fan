import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { VerificationStep } from "./VerificationStep";
import { FacialVerification } from "./FacialVerification";
import { GameSelection } from "./GameSelection";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// Extend the schema with additional validations
const formSchema = insertUserSchema
  .extend({
    username: z
      .string()
      .min(3, "Nome de usuário deve ter pelo menos 3 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string(),
    cpf: z
      .string()
      .regex(
        /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
        "CPF deve estar no formato 000.000.000-00"
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof formSchema>;

interface RegisterFormProps {
  onShowLogin: () => void;
}

export function RegisterForm({ onShowLogin }: RegisterFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(25);
  const [stepTitle, setStepTitle] = useState("Informações Básicas");
  const {
    registerMutation,
    verifyIdentityMutation,
    verifyFaceMutation,
    selectGameMutation,
  } = useAuth();

  const stepTitles = [
    "Informações Básicas",
    "Verificação de Identidade",
    "Verificação Facial",
    "Finalização",
  ];

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      cpf: "",
    },
  });

  // State for ID verification
  const [frontIdUrl, setFrontIdUrl] = useState("");
  const [backIdUrl, setBackIdUrl] = useState("");

  // State for game selection
  const [selectedGame, setSelectedGame] = useState<string>("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const nextStep = () => {
    const newStep = currentStep + 1;
    setCurrentStep(newStep);
    setProgress(newStep * 25);
    setStepTitle(stepTitles[newStep - 1]);
  };

  const prevStep = () => {
    const newStep = currentStep - 1;
    setCurrentStep(newStep);
    setProgress(newStep * 25);
    setStepTitle(stepTitles[newStep - 1]);
  };

  const onSubmitBasicInfo = async (data: RegisterFormValues) => {
    // Save form data and move to next step
    nextStep();
  };

  const onSubmitIDVerification = async (frontId: string, backId: string) => {
    setFrontIdUrl(frontId);
    setBackIdUrl(backId);
    nextStep();
  };

  const onSubmitFacialVerification = async () => {
    nextStep();
  };

  const onSubmitGameSelection = async () => {
    if (!selectedGame) {
      return;
    }

    if (!termsAccepted) {
      return;
    }

    const formData = form.getValues();

    try {
      // Register user
      const user = await registerMutation.mutateAsync({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        cpf: formData.cpf,
      });

      // After successful registration, verify ID
      if (frontIdUrl && backIdUrl) {
        await verifyIdentityMutation.mutateAsync({
          frontIdUrl,
          backIdUrl,
        });
      }

      // Verify face
      await verifyFaceMutation.mutateAsync();

      // Set favorite game
      await selectGameMutation.mutateAsync({
        favoriteGame: selectedGame,
      });
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmitBasicInfo)}
              id="step1"
              className="space-y-4"
            >
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
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">
                      Nome de Usuário
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="seu_username"
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
                    <FormDescription className="text-gray-400 text-xs">
                      A senha deve conter pelo menos 6 caracteres
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">
                      Confirmar Senha
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="********"
                        className="w-full bg-furia-lightGray text-white border border-gray-700 rounded px-4 py-2 focus:outline-none focus:border-furia-red"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cpf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">CPF</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="000.000.000-00"
                        className="w-full bg-furia-lightGray text-white border border-gray-700 rounded px-4 py-2 focus:outline-none focus:border-furia-red"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onShowLogin}
                  className="bg-transparent border border-gray-700 text-white px-6 py-2 rounded hover:bg-furia-lightGray transition-colors"
                >
                  Voltar
                </Button>
                <Button
                  type="submit"
                  className="bg-furia-red text-white px-6 py-2 rounded font-rajdhani font-bold hover:bg-red-700 transition-colors"
                >
                  Continuar
                </Button>
              </div>
            </form>
          </Form>
        );
      case 2:
        return (
          <VerificationStep onBack={prevStep} onNext={onSubmitIDVerification} />
        );
      case 3:
        return (
          <FacialVerification
            onBack={prevStep}
            onNext={onSubmitFacialVerification}
          />
        );
      case 4:
        return (
          <GameSelection
            selectedGame={selectedGame}
            setSelectedGame={setSelectedGame}
            termsAccepted={termsAccepted}
            setTermsAccepted={setTermsAccepted}
            onBack={prevStep}
            onNext={onSubmitGameSelection}
            isPending={
              registerMutation.isPending ||
              verifyIdentityMutation.isPending ||
              verifyFaceMutation.isPending ||
              selectGameMutation.isPending
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto max-w-3xl">
      <div className="auth-container p-8 rounded-lg border border-furia-red/30 shadow-lg">
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
            Cadastro FURIA
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            Crie sua conta para acessar o conteúdo exclusivo
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-400">
              Etapa <span id="currentStep">{currentStep}</span> de 4
            </span>
            <span className="text-sm text-gray-400" id="stepTitle">
              {stepTitle}
            </span>
          </div>
          <div className="w-full bg-furia-lightGray rounded-full h-2 mb-4">
            <div
              className="bg-furia-red h-2 rounded-full progress-bar"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {renderStep()}
      </div>
    </div>
  );
}
