import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/home/HeroSection";
import { UpcomingMatches } from "@/components/home/UpcomingMatches";
import { LatestNews } from "@/components/home/LatestNews";
import { Footer } from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-16">
        <HeroSection />
        <UpcomingMatches />
        <LatestNews />
      </main>
      
      <Footer />
    </div>
  );
}
