import Hero from "@/components/Hero";
import Verse from "@/components/Verse";
import Countdown from "@/components/Countdown";
import Families from "@/components/Families";
import Events from "@/components/Events";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <main>
      <Hero />
      <Verse />
      <Countdown />
      <Families />
      <Events />
      <Footer />
    </main>
  );
}
