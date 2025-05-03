import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FacialVerificationProps {
  onBack: () => void;
  onNext: () => void;
}

export function FacialVerification({
  onBack,
  onNext,
}: FacialVerificationProps) {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [capturedUrl, setCapturedUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      // Clean up the stream when component unmounts
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }

      setShowCamera(true);

      // Start countdown
      setCountdown(3);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            startVerification();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Erro ao acessar câmera",
        description: "Verifique se você permitiu o acesso à câmera.",
        variant: "destructive",
      });
    }
  };
const startVerification = async () => {
  setIsVerifying(true);

  if (canvasRef.current && videoRef.current) {
    const context = canvasRef.current.getContext("2d");
    if (context) {
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);

      const imageBase64 = canvasRef.current.toDataURL("image/jpeg");
      setCapturedUrl(imageBase64);

      try {
        const response = await fetch(
          "http://localhost:3000/api/compare-faces",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ image1: imageBase64 }),
          }
        );

        const result = await response.json();

        if (result.isSamePerson) {
          setIsVerified(true);
          toast({
            title: "Verificação concluída",
            description: "Sua identidade foi verificada com sucesso.",
          });
        } else {
          toast({
            title: "Verificação falhou",
            description: "As imagens não correspondem.",
            variant: "destructive",
          });
        }
      } catch (err: any) {
        console.error("Erro na verificação:", err);
        toast({
          title: "Erro interno",
          description: "Não foi possível realizar a verificação facial.",
          variant: "destructive",
        });
      }

      if (stream) stream.getTracks().forEach((track) => track.stop());
    }
  }

  setIsVerifying(false);
};

  const handleContinue = () => {
    if (isVerified) {
      onNext();
    } else {
      toast({
        title: "Verificação necessária",
        description:
          "Por favor, complete a verificação facial antes de continuar.",
        variant: "destructive",
      });
    }
  };

  return (
    <div id="step3">
      <p className="text-gray-400 text-sm mb-6">
        Precisamos verificar se você é realmente você! Vamos fazer uma
        verificação facial.
      </p>

      <div className="mb-6">
        <div className="relative w-full h-64 rounded-lg overflow-hidden bg-black mb-4">
          <video
            ref={videoRef}
            className={`w-full h-full object-cover ${
              showCamera ? "block" : "hidden"
            }`}
          ></video>

          <canvas ref={canvasRef} className="hidden"></canvas>

          {!showCamera && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Camera className="h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-400 text-center">
                Câmera será ativada
                <br />
                quando você iniciar a verificação
              </p>
            </div>
          )}

          {showCamera && countdown > 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="text-white text-6xl font-bold">{countdown}</span>
            </div>
          )}

          {isVerifying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Loader2 className="h-12 w-12 text-furia-red animate-spin" />
            </div>
          )}

          {isVerified && (
            <div className="absolute inset-0 border-4 border-green-500 rounded-lg flex items-center justify-center">
              <div className="bg-green-500 rounded-full p-4">
                <Check className="h-12 w-12 text-white" />
              </div>
            </div>
          )}
        </div>

        <Button
          type="button"
          onClick={startCamera}
          disabled={showCamera || isVerified}
          className="w-full bg-furia-red text-white py-3 rounded font-rajdhani font-bold hover:bg-red-700 transition-colors mb-4"
        >
          <i className="ri-camera-line mr-2"></i> Iniciar Verificação Facial
        </Button>

        <p className="text-gray-500 text-xs text-center">
          Certifique-se de estar em um ambiente bem iluminado e olhe diretamente
          para a câmera
        </p>
      </div>

      <div className="flex justify-between">
        <Button
          type="button"
          onClick={onBack}
          variant="outline"
          className="bg-transparent border border-gray-700 text-white px-6 py-2 rounded hover:bg-furia-lightGray transition-colors"
        >
          Voltar
        </Button>
        <Button
          type="button"
          onClick={handleContinue}
          disabled={!isVerified}
          className={`${
            isVerified ? "bg-furia-red" : "bg-gray-700"
          } text-white px-6 py-2 rounded font-rajdhani font-bold hover:bg-red-700 transition-colors`}
        >
          Continuar
        </Button>
      </div>
    </div>
  );
}
