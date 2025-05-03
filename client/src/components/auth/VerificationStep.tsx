import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VerificationStepProps {
  onBack: () => void;
  onNext: (frontId: string, backId: string) => void;
}

export function VerificationStep({ onBack, onNext }: VerificationStepProps) {
  const { toast } = useToast();
  const [frontId, setFrontId] = useState<File | null>(null);
  const [backId, setBackId] = useState<File | null>(null);
  const [frontIdPreview, setFrontIdPreview] = useState<string | null>(null);
  const [backIdPreview, setBackIdPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFrontIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFrontId(file);
      const reader = new FileReader();
      reader.onload = () => {
        setFrontIdPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBackId(file);
      const reader = new FileReader();
      reader.onload = () => {
        setBackIdPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!frontId || !backId) {
      toast({
        title: "Erro na validação",
        description: "Por favor, faça o upload de ambas as imagens do RG.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("frontId", frontId);
      formData.append("backId", backId);

      const response = await fetch("/api/upload-id", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Falha ao fazer upload das imagens");
      }

      const data = await response.json();
      onNext(data.frontIdUrl, data.backIdUrl);
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Erro no upload",
        description: "Houve um problema ao enviar as imagens. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div id="step2">
      <p className="text-gray-400 text-sm mb-6">Para confirmar sua identidade, precisamos que você envie fotos do seu RG</p>
      
      <div className="mb-6">
        <label className="block text-gray-300 mb-2 text-sm">Frente do RG</label>
        <div 
          className={`border-2 border-dashed ${frontIdPreview ? 'border-green-500' : 'border-gray-700'} rounded-lg p-4 text-center hover:border-furia-red transition-colors cursor-pointer`}
          onClick={() => document.getElementById("frontIDInput")?.click()}
        >
          {frontIdPreview ? (
            <div className="flex flex-col items-center">
              <div className="text-green-500 text-3xl mb-2"><i className="ri-check-line"></i></div>
              <p className="text-green-400 text-sm">Arquivo enviado com sucesso</p>
              <p className="text-gray-500 text-xs mt-2">{frontId?.name}</p>
            </div>
          ) : (
            <div>
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Clique para fazer upload ou arraste o arquivo</p>
              <p className="text-gray-500 text-xs mt-2">JPG ou PNG, máximo 5MB</p>
            </div>
          )}
          <input 
            type="file" 
            className="hidden" 
            id="frontIDInput" 
            accept="image/*"
            onChange={handleFrontIdChange}
          />
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-gray-300 mb-2 text-sm">Verso do RG</label>
        <div 
          className={`border-2 border-dashed ${backIdPreview ? 'border-green-500' : 'border-gray-700'} rounded-lg p-4 text-center hover:border-furia-red transition-colors cursor-pointer`}
          onClick={() => document.getElementById("backIDInput")?.click()}
        >
          {backIdPreview ? (
            <div className="flex flex-col items-center">
              <div className="text-green-500 text-3xl mb-2"><i className="ri-check-line"></i></div>
              <p className="text-green-400 text-sm">Arquivo enviado com sucesso</p>
              <p className="text-gray-500 text-xs mt-2">{backId?.name}</p>
            </div>
          ) : (
            <div>
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Clique para fazer upload ou arraste o arquivo</p>
              <p className="text-gray-500 text-xs mt-2">JPG ou PNG, máximo 5MB</p>
            </div>
          )}
          <input 
            type="file" 
            className="hidden" 
            id="backIDInput" 
            accept="image/*"
            onChange={handleBackIdChange}
          />
        </div>
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
          onClick={handleSubmit}
          disabled={!frontId || !backId || isUploading}
          className="bg-furia-red text-white px-6 py-2 rounded font-rajdhani font-bold hover:bg-red-700 transition-colors"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...
            </>
          ) : (
            "Continuar"
          )}
        </Button>
      </div>
    </div>
  );
}
