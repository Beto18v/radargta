import CrewGrid from "@/components/CrewGrid";
import DiscordCTA from "@/components/DiscordCTA";
import Footer from "@/components/Footer";
import HardwareGuide from "@/components/HardwareGuide";
import Hero from "@/components/Hero";
import { seedCrews } from "@/lib/data/crews";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <CrewGrid crews={seedCrews} />
        <HardwareGuide />
        <DiscordCTA />
      </main>
      <Footer />
    </>
  );
}