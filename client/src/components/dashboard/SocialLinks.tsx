import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Instagram, Loader2 } from "lucide-react";
import {
  Facebook,
  Twitter,
  Twitch,
  Link as LinkIcon,
} from "lucide-react";
import { RiDiscordFill } from "react-icons/ri";

export function SocialLinks() {
  const { user, updateSocialMutation } = useAuth();
  const [socialForm, setSocialForm] = useState({
    twitter: user?.twitter || "",
    instagram: user?.instagram || "",
    facebook: user?.facebook || "",
    discord: user?.discord || "",
    twitch: user?.twitch || "",
  });
  const [openDialog, setOpenDialog] = useState("");

  if (!user) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSocialForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveSocial = async () => {
    if (!openDialog) return;

    const socialData: any = {};
    socialData[openDialog] = socialForm[openDialog as keyof typeof socialForm];

    await updateSocialMutation.mutateAsync(socialData);
    setOpenDialog("");
  };

  return (
    <div className="bg-black/50 rounded-lg p-6">
      <h3 className="font-rajdhani font-bold text-xl mb-4">
        Conecte suas Redes
      </h3>

      <div className="space-y-3">
        <Dialog
          open={openDialog === "twitter"}
          onOpenChange={(open) =>
            open ? setOpenDialog("twitter") : setOpenDialog("")
          }
        >
          <DialogTrigger asChild>
            <Button
              className={`w-full flex items-center justify-between p-3 rounded hover:bg-sky-600 transition-colors ${
                user.twitter ? "bg-sky-500" : "bg-sky-500/70"
              }`}
            >
              <div className="flex items-center">
                <Twitter className="text-xl mr-3" />
                <span>Twitter</span>
              </div>
              {user.twitter ? (
                <span className="text-green-300 text-xs">Conectado</span>
              ) : (
                <LinkIcon className="h-4 w-4" />
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-furia-darkBlue border-furia-red/30 text-white">
            <DialogHeader>
              <DialogTitle className="font-rajdhani text-xl">
                Conectar Twitter
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input
                name="twitter"
                value={socialForm.twitter}
                onChange={handleInputChange}
                placeholder="Seu nome de usuário do Twitter"
                className="bg-furia-lightGray border-gray-700 text-white"
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="border-gray-700 text-white hover:bg-furia-lightGray"
                >
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                onClick={handleSaveSocial}
                className="bg-furia-red hover:bg-red-700"
                disabled={updateSocialMutation.isPending}
              >
                {updateSocialMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando
                  </>
                ) : (
                  "Conectar"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={openDialog === "instagram"}
          onOpenChange={(open) =>
            open ? setOpenDialog("instagram") : setOpenDialog("")
          }
        >
          <DialogTrigger asChild>
            <Button
              className={`w-full flex items-center justify-between p-3 rounded transition-colors
    ${
      user.instagram
        ? "bg-pink-500 hover:bg-pink-600"
        : "bg-pink-400 hover:bg-pink-500"
    }
  `}
            >
              <div className="flex items-center">
                <Instagram className="text-xl mr-3" />
                <span>Instagram</span>
              </div>
              {user.instagram ? (
                <span className="text-green-300 text-xs">Conectado</span>
              ) : (
                <LinkIcon className="h-4 w-4" />
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-furia-darkBlue border-furia-red/30 text-white">
            <DialogHeader>
              <DialogTitle className="font-rajdhani text-xl">
                Conectar Instagram
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input
                name="twitter"
                value={socialForm.instagram}
                onChange={handleInputChange}
                placeholder="Seu nome de usuário do Twitter"
                className="bg-furia-lightGray border-gray-700 text-white"
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="border-gray-700 text-white hover:bg-furia-lightGray"
                >
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                onClick={handleSaveSocial}
                className="bg-furia-red hover:bg-red-700"
                disabled={updateSocialMutation.isPending}
              >
                {updateSocialMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando
                  </>
                ) : (
                  "Conectar"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={openDialog === "facebook"}
          onOpenChange={(open) =>
            open ? setOpenDialog("facebook") : setOpenDialog("")
          }
        >
          <DialogTrigger asChild>
            <Button
              className={`w-full flex items-center justify-between p-3 rounded hover:bg-blue-700 transition-colors ${
                user.facebook ? "bg-blue-600" : "bg-blue-600/70"
              }`}
            >
              <div className="flex items-center">
                <Facebook className="text-xl mr-3" />
                <span>Facebook</span>
              </div>
              {user.facebook ? (
                <span className="text-green-300 text-xs">Conectado</span>
              ) : (
                <LinkIcon className="h-4 w-4" />
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-furia-darkBlue border-furia-red/30 text-white">
            <DialogHeader>
              <DialogTitle className="font-rajdhani text-xl">
                Conectar Facebook
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input
                name="facebook"
                value={socialForm.facebook}
                onChange={handleInputChange}
                placeholder="URL do seu perfil do Facebook"
                className="bg-furia-lightGray border-gray-700 text-white"
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="border-gray-700 text-white hover:bg-furia-lightGray"
                >
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                onClick={handleSaveSocial}
                className="bg-furia-red hover:bg-red-700"
                disabled={updateSocialMutation.isPending}
              >
                {updateSocialMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando
                  </>
                ) : (
                  "Conectar"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={openDialog === "discord"}
          onOpenChange={(open) =>
            open ? setOpenDialog("discord") : setOpenDialog("")
          }
        >
          <DialogTrigger asChild>
            <Button
              className={`w-full flex items-center justify-between p-3 rounded hover:bg-[#5e73bc] transition-colors ${
                user.discord ? "bg-[#7289DA]" : "bg-[#7289DA]/70"
              }`}
            >
              <div className="flex items-center">
                <RiDiscordFill className="text-xl mr-3" />
                <span>Discord</span>
              </div>
              {user.discord ? (
                <span className="text-green-300 text-xs">Conectado</span>
              ) : (
                <LinkIcon className="h-4 w-4" />
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-furia-darkBlue border-furia-red/30 text-white">
            <DialogHeader>
              <DialogTitle className="font-rajdhani text-xl">
                Conectar Discord
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input
                name="discord"
                value={socialForm.discord}
                onChange={handleInputChange}
                placeholder="Seu usuário do Discord (ex: usuario#1234)"
                className="bg-furia-lightGray border-gray-700 text-white"
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="border-gray-700 text-white hover:bg-furia-lightGray"
                >
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                onClick={handleSaveSocial}
                className="bg-furia-red hover:bg-red-700"
                disabled={updateSocialMutation.isPending}
              >
                {updateSocialMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando
                  </>
                ) : (
                  "Conectar"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={openDialog === "twitch"}
          onOpenChange={(open) =>
            open ? setOpenDialog("twitch") : setOpenDialog("")
          }
        >
          <DialogTrigger asChild>
            <Button
              className={`w-full flex items-center justify-between p-3 rounded hover:bg-purple-700 transition-colors ${
                user.twitch ? "bg-purple-600" : "bg-purple-600/70"
              }`}
            >
              <div className="flex items-center">
                <Twitch className="text-xl mr-3" />
                <span>Twitch</span>
              </div>
              {user.twitch ? (
                <span className="text-green-300 text-xs">Conectado</span>
              ) : (
                <LinkIcon className="h-4 w-4" />
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-furia-darkBlue border-furia-red/30 text-white">
            <DialogHeader>
              <DialogTitle className="font-rajdhani text-xl">
                Conectar Twitch
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input
                name="twitch"
                value={socialForm.twitch}
                onChange={handleInputChange}
                placeholder="Seu canal da Twitch"
                className="bg-furia-lightGray border-gray-700 text-white"
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="border-gray-700 text-white hover:bg-furia-lightGray"
                >
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                onClick={handleSaveSocial}
                className="bg-furia-red hover:bg-red-700"
                disabled={updateSocialMutation.isPending}
              >
                {updateSocialMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando
                  </>
                ) : (
                  "Conectar"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
