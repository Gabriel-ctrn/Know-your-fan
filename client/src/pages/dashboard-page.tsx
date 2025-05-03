import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { UserProfile } from "@/components/dashboard/UserProfile";
import { NextMatch } from "@/components/dashboard/NextMatch";
import { NewsSection } from "@/components/dashboard/NewsSection";
import { GameLevel } from "@/components/dashboard/GameLevel";
import { UpcomingGames } from "@/components/dashboard/UpcomingGames";
import { SocialLinks } from "@/components/dashboard/SocialLinks";
import { LiveMatch } from "@/components/dashboard/LiveMatch";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { ProductReviewCard } from "@/components/dashboard/ProductReviewCard";
import { MatchHistory } from "@/components/dashboard/MatchHistory";
import DashboardAdminPage from "@/components/dashboard/AdminProfile";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();

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
    return null; // The ProtectedRoute component will handle the redirect
  }

  if (user.username == "furia_admin") {
    return (
      <DashboardAdminPage/>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-furia-darkBlue">
      <Navbar />
      
      <main className="flex-grow pt-16">
        <UserProfile />
        
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content - 2/3 width on desktop */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                <LiveMatch />
              </div>
              <NextMatch />
              <MatchHistory/>
              <NewsSection />
            </div>
            
            {/* Sidebar - 1/3 width on desktop */}
            <div>
              {/* Gamification Level */}
              <GameLevel />
              
              {/* Upcoming Games */}
              <UpcomingGames />
              <ProductReviewCard/>
              
              {/* Social Linking */}
              <SocialLinks />

            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
