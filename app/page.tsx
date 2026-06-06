import Hero from "@/components/Hero";
import Verse from "@/components/Verse";
import Bond from "@/components/Bond";
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
      <Bond />
      <Footer />
    </main>
  );
}
